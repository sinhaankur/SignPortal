// ============================================================================
// SignPortal - High-Security Signing Workflow Service
// .NET 8 Implementation
// 
// This service handles the branching logic between:
// - Simple Electronic Signature (SES) - Standard documents
// - Advanced Electronic Signature (AES) - Confidential documents with MFA
// ============================================================================

using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace SignPortal.Services;

#region Enums & Constants

/// <summary>
/// Document classification levels following security standards
/// </summary>
public enum DocumentClassification
{
    Public = 0,
    Internal = 1,
    Confidential = 2,
    Restricted = 3
}

/// <summary>
/// Signature workflow types
/// </summary>
public enum SignatureWorkflowType
{
    /// <summary>Simple Electronic Signature - click to sign</summary>
    SES,
    /// <summary>Advanced Electronic Signature - MFA required</summary>
    AES
}

/// <summary>
/// MFA verification stages
/// </summary>
public enum MfaStage
{
    NotRequired,
    LdapPending,
    LdapCompleted,
    SmsPending,
    SmsCompleted,
    BiometricPending,
    BiometricCompleted,
    AllCompleted,
    Failed
}

/// <summary>
/// AI scan result status
/// </summary>
public enum AiScanResult
{
    NotScanned,
    Pass,
    Fail,
    Warning,
    Error
}

/// <summary>
/// Workflow execution status
/// </summary>
public enum WorkflowStatus
{
    Initiated,
    MfaInProgress,
    AiScanning,
    PendingApproval,
    ReadyForSignature,
    Completed,
    Failed,
    Cancelled
}

#endregion

#region DTOs & Models

/// <summary>
/// Document metadata for workflow evaluation
/// </summary>
public record DocumentContext
{
    public required Guid DocumentId { get; init; }
    public required string DocumentName { get; init; }
    public required DocumentClassification Classification { get; init; }
    public required string[] Tags { get; init; }
    public required string DocumentHash { get; init; }
    public required Guid CreatedBy { get; init; }
    public required DateTime FinalizedAt { get; init; }
    public string? Department { get; init; }
    public long FileSizeBytes { get; init; }
}

/// <summary>
/// User context for signing session
/// </summary>
public record SignerContext
{
    public required Guid UserId { get; init; }
    public required string Email { get; init; }
    public required string FullName { get; init; }
    public required string Designation { get; init; }
    public required string Department { get; init; }
    public required string IpAddress { get; init; }
    public required string UserAgent { get; init; }
    public string? PhoneNumber { get; init; }
    public string? LdapDistinguishedName { get; init; }
}

/// <summary>
/// MFA session state
/// </summary>
public record MfaSession
{
    public required Guid SessionId { get; init; }
    public required Guid AuditId { get; init; }
    public required MfaStage CurrentStage { get; init; }
    public required DateTime ExpiresAt { get; init; }
    
    public bool LdapCompleted { get; init; }
    public DateTime? LdapCompletedAt { get; init; }
    public string? LdapUserDn { get; init; }
    
    public bool SmsCompleted { get; init; }
    public DateTime? SmsCompletedAt { get; init; }
    public string? SmsOtpHash { get; init; }
    public int SmsAttempts { get; init; }
    
    public bool BiometricCompleted { get; init; }
    public DateTime? BiometricCompletedAt { get; init; }
    public string? BiometricMethod { get; init; }
    public string? WebAuthnCredentialId { get; init; }
}

/// <summary>
/// AI PII scan results
/// </summary>
public record AiScanContext
{
    public required Guid ScanId { get; init; }
    public required AiScanResult Result { get; init; }
    public required bool PiiFound { get; init; }
    public required string[] PiiTypes { get; init; }
    public required PiiLocation[] PiiLocations { get; init; }
    public required double ConfidenceScore { get; init; }
    public required string ModelVersion { get; init; }
    public required int ProcessingTimeMs { get; init; }
}

public record PiiLocation
{
    public int Page { get; init; }
    public string Type { get; init; } = string.Empty;
    public int[] BoundingBox { get; init; } = Array.Empty<int>();
    public double Confidence { get; init; }
}

/// <summary>
/// Workflow evaluation result
/// </summary>
public record WorkflowEvaluationResult
{
    public required SignatureWorkflowType WorkflowType { get; init; }
    public required bool MfaRequired { get; init; }
    public required bool AiScanRequired { get; init; }
    public required string[] RequiredMfaLayers { get; init; }
    public required WorkflowStatus InitialStatus { get; init; }
    public string? Reason { get; init; }
}

/// <summary>
/// Signature request DTO
/// </summary>
public record SignatureRequest
{
    public required DocumentContext Document { get; init; }
    public required SignerContext Signer { get; init; }
    public MfaSession? MfaSession { get; init; }
    public AiScanContext? AiScanResult { get; init; }
    public bool ConsentGiven { get; init; }
    public string? SignatureImageBase64 { get; init; }
}

/// <summary>
/// Signature result
/// </summary>
public record SignatureResult
{
    public required bool Success { get; init; }
    public required Guid AuditId { get; init; }
    public required WorkflowStatus Status { get; init; }
    public Guid? SignatureId { get; init; }
    public string? SignatureValue { get; init; }
    public DateTime? SignedAt { get; init; }
    public string? ErrorMessage { get; init; }
    public string? NextAction { get; init; }
}

#endregion

#region Interfaces

/// <summary>
/// LDAP authentication service interface
/// </summary>
public interface ILdapService
{
    Task<(bool Success, string? UserDn, string? ErrorMessage)> AuthenticateAsync(
        string username, 
        string password, 
        CancellationToken ct = default);
}

/// <summary>
/// SMS OTP service interface
/// </summary>
public interface ISmsOtpService
{
    Task<(bool Success, string OtpHash, string MessageId)> SendOtpAsync(
        string phoneNumber, 
        CancellationToken ct = default);
    
    Task<bool> VerifyOtpAsync(
        string inputOtp, 
        string storedOtpHash, 
        CancellationToken ct = default);
}

/// <summary>
/// WebAuthn/FIDO2 service interface
/// </summary>
public interface IWebAuthnService
{
    Task<string> GenerateChallengeAsync(
        Guid userId, 
        CancellationToken ct = default);
    
    Task<(bool Success, string? CredentialId, string? Method)> VerifyAssertionAsync(
        Guid userId,
        string challenge,
        string clientDataJson,
        string authenticatorData,
        string signature,
        CancellationToken ct = default);
}

/// <summary>
/// AI PII scanner service interface
/// </summary>
public interface IAiPiiScannerService
{
    Task<AiScanContext> ScanDocumentAsync(
        Guid documentId, 
        byte[] documentBytes, 
        CancellationToken ct = default);
}

/// <summary>
/// HSM/Key management service interface
/// </summary>
public interface IHsmService
{
    Task<byte[]> SignHashAsync(
        byte[] hash, 
        string keyId, 
        CancellationToken ct = default);
    
    Task<string> GetSigningCertificateThumbprintAsync(
        string keyId, 
        CancellationToken ct = default);
}

/// <summary>
/// Audit trail repository interface
/// </summary>
public interface IAuditTrailRepository
{
    Task<Guid> CreateAuditRecordAsync(
        DocumentContext document,
        SignerContext signer,
        SignatureWorkflowType workflowType,
        CancellationToken ct = default);
    
    Task UpdateMfaStatusAsync(
        Guid auditId,
        string mfaLayer,
        bool success,
        string? details = null,
        CancellationToken ct = default);
    
    Task UpdateAiScanResultAsync(
        Guid auditId,
        AiScanContext scanResult,
        CancellationToken ct = default);
    
    Task CompleteSignatureAsync(
        Guid auditId,
        Guid signatureId,
        string signatureValue,
        string documentHash,
        CancellationToken ct = default);
    
    Task FailWorkflowAsync(
        Guid auditId,
        string reason,
        CancellationToken ct = default);
}

#endregion

/// <summary>
/// Main Workflow Service handling SES/AES branching logic
/// </summary>
public class WorkflowService
{
    private readonly ILogger<WorkflowService> _logger;
    private readonly ILdapService _ldapService;
    private readonly ISmsOtpService _smsOtpService;
    private readonly IWebAuthnService _webAuthnService;
    private readonly IAiPiiScannerService _aiScanner;
    private readonly IHsmService _hsmService;
    private readonly IAuditTrailRepository _auditRepository;
    
    // Configuration
    private static readonly string[] ConfidentialTags = 
    { 
        "confidential", 
        "restricted", 
        "pii", 
        "hipaa", 
        "financial", 
        "legal",
        "executive",
        "board"
    };
    
    private static readonly string[] AesRequiredDepartments = 
    { 
        "Legal", 
        "Finance", 
        "Executive", 
        "HR", 
        "Compliance" 
    };
    
    private static readonly int MfaSessionTimeoutMinutes = 15;
    private static readonly int MaxOtpAttempts = 3;
    
    public WorkflowService(
        ILogger<WorkflowService> logger,
        ILdapService ldapService,
        ISmsOtpService smsOtpService,
        IWebAuthnService webAuthnService,
        IAiPiiScannerService aiScanner,
        IHsmService hsmService,
        IAuditTrailRepository auditRepository)
    {
        _logger = logger;
        _ldapService = ldapService;
        _smsOtpService = smsOtpService;
        _webAuthnService = webAuthnService;
        _aiScanner = aiScanner;
        _hsmService = hsmService;
        _auditRepository = auditRepository;
    }

    #region Workflow Evaluation (The Core Branching Logic)

    /// <summary>
    /// Evaluates the document and determines which workflow to use (SES or AES)
    /// This is the main IF/ELSE branching logic as specified
    /// </summary>
    public WorkflowEvaluationResult EvaluateWorkflow(DocumentContext document)
    {
        _logger.LogInformation(
            "Evaluating workflow for document {DocumentId} with classification {Classification}",
            document.DocumentId,
            document.Classification);

        // ============================================================
        // PRIMARY BRANCHING LOGIC: Check if AES (Advanced) is required
        // ============================================================
        
        bool requiresAes = false;
        var reasons = new List<string>();
        
        // Condition 1: Document Classification is Confidential or Restricted
        if (document.Classification >= DocumentClassification.Confidential)
        {
            requiresAes = true;
            reasons.Add($"Document classification is {document.Classification}");
        }
        
        // Condition 2: Document has confidential tags
        var matchingTags = document.Tags
            .Where(t => ConfidentialTags.Contains(t.ToLowerInvariant()))
            .ToArray();
        
        if (matchingTags.Length > 0)
        {
            requiresAes = true;
            reasons.Add($"Document has confidential tags: {string.Join(", ", matchingTags)}");
        }
        
        // Condition 3: Document belongs to sensitive department
        if (document.Department != null && 
            AesRequiredDepartments.Contains(document.Department, StringComparer.OrdinalIgnoreCase))
        {
            requiresAes = true;
            reasons.Add($"Document belongs to sensitive department: {document.Department}");
        }
        
        // Condition 4: Large documents (>10MB) require additional verification
        if (document.FileSizeBytes > 10 * 1024 * 1024)
        {
            requiresAes = true;
            reasons.Add($"Large document ({document.FileSizeBytes / 1024 / 1024}MB) requires additional verification");
        }

        // ============================================================
        // DECISION: Return appropriate workflow configuration
        // ============================================================
        
        if (requiresAes)
        {
            _logger.LogInformation(
                "Document {DocumentId} requires AES workflow. Reasons: {Reasons}",
                document.DocumentId,
                string.Join("; ", reasons));
            
            return new WorkflowEvaluationResult
            {
                WorkflowType = SignatureWorkflowType.AES,
                MfaRequired = true,
                AiScanRequired = true,
                RequiredMfaLayers = new[] { "LDAP", "SMS_OTP", "WEBAUTHN" },
                InitialStatus = WorkflowStatus.MfaInProgress,
                Reason = string.Join("; ", reasons)
            };
        }
        else
        {
            _logger.LogInformation(
                "Document {DocumentId} can use SES workflow (standard signature)",
                document.DocumentId);
            
            return new WorkflowEvaluationResult
            {
                WorkflowType = SignatureWorkflowType.SES,
                MfaRequired = false,
                AiScanRequired = false,
                RequiredMfaLayers = Array.Empty<string>(),
                InitialStatus = WorkflowStatus.ReadyForSignature,
                Reason = "Standard document - Simple Electronic Signature sufficient"
            };
        }
    }

    #endregion

    #region Signature Execution

    /// <summary>
    /// Executes the appropriate signature workflow based on evaluation
    /// </summary>
    public async Task<SignatureResult> ExecuteSignatureAsync(
        SignatureRequest request,
        CancellationToken ct = default)
    {
        var evaluation = EvaluateWorkflow(request.Document);
        
        // Create audit trail record
        var auditId = await _auditRepository.CreateAuditRecordAsync(
            request.Document,
            request.Signer,
            evaluation.WorkflowType,
            ct);
        
        _logger.LogInformation(
            "Starting {WorkflowType} workflow for document {DocumentId}, audit {AuditId}",
            evaluation.WorkflowType,
            request.Document.DocumentId,
            auditId);
        
        try
        {
            // ========================================
            // BRANCH: AES (Advanced Electronic Signature)
            // ========================================
            if (evaluation.WorkflowType == SignatureWorkflowType.AES)
            {
                return await ExecuteAesWorkflowAsync(request, auditId, ct);
            }
            // ========================================
            // BRANCH: SES (Simple Electronic Signature)
            // ========================================
            else
            {
                return await ExecuteSesWorkflowAsync(request, auditId, ct);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, 
                "Workflow execution failed for document {DocumentId}", 
                request.Document.DocumentId);
            
            await _auditRepository.FailWorkflowAsync(auditId, ex.Message, ct);
            
            return new SignatureResult
            {
                Success = false,
                AuditId = auditId,
                Status = WorkflowStatus.Failed,
                ErrorMessage = ex.Message
            };
        }
    }

    /// <summary>
    /// Execute Simple Electronic Signature workflow
    /// </summary>
    private async Task<SignatureResult> ExecuteSesWorkflowAsync(
        SignatureRequest request,
        Guid auditId,
        CancellationToken ct)
    {
        _logger.LogInformation("Executing SES workflow for audit {AuditId}", auditId);
        
        // Verify consent
        if (!request.ConsentGiven)
        {
            return new SignatureResult
            {
                Success = false,
                AuditId = auditId,
                Status = WorkflowStatus.Failed,
                ErrorMessage = "User consent is required for signature",
                NextAction = "CONSENT_REQUIRED"
            };
        }
        
        // Generate simple signature
        var signatureId = Guid.NewGuid();
        var signatureValue = GenerateSimpleSignature(
            request.Document.DocumentHash,
            request.Signer.UserId,
            DateTime.UtcNow);
        
        // Complete the signature
        await _auditRepository.CompleteSignatureAsync(
            auditId,
            signatureId,
            signatureValue,
            request.Document.DocumentHash,
            ct);
        
        _logger.LogInformation(
            "SES signature completed for audit {AuditId}, signature {SignatureId}",
            auditId,
            signatureId);
        
        return new SignatureResult
        {
            Success = true,
            AuditId = auditId,
            SignatureId = signatureId,
            SignatureValue = signatureValue,
            Status = WorkflowStatus.Completed,
            SignedAt = DateTime.UtcNow
        };
    }

    /// <summary>
    /// Execute Advanced Electronic Signature workflow with MFA
    /// </summary>
    private async Task<SignatureResult> ExecuteAesWorkflowAsync(
        SignatureRequest request,
        Guid auditId,
        CancellationToken ct)
    {
        _logger.LogInformation("Executing AES workflow for audit {AuditId}", auditId);
        
        // ========================================
        // Step 1: Verify MFA completion
        // ========================================
        if (request.MfaSession == null)
        {
            return new SignatureResult
            {
                Success = false,
                AuditId = auditId,
                Status = WorkflowStatus.MfaInProgress,
                ErrorMessage = "MFA session required for AES signature",
                NextAction = "MFA_REQUIRED"
            };
        }
        
        var mfaValidation = ValidateMfaSession(request.MfaSession);
        if (!mfaValidation.IsValid)
        {
            return new SignatureResult
            {
                Success = false,
                AuditId = auditId,
                Status = WorkflowStatus.MfaInProgress,
                ErrorMessage = mfaValidation.ErrorMessage,
                NextAction = mfaValidation.NextAction
            };
        }
        
        // ========================================
        // Step 2: Verify AI PII scan
        // ========================================
        if (request.AiScanResult == null)
        {
            return new SignatureResult
            {
                Success = false,
                AuditId = auditId,
                Status = WorkflowStatus.AiScanning,
                ErrorMessage = "AI PII scan required before signature",
                NextAction = "AI_SCAN_REQUIRED"
            };
        }
        
        if (request.AiScanResult.Result == AiScanResult.Fail)
        {
            await _auditRepository.UpdateAiScanResultAsync(auditId, request.AiScanResult, ct);
            
            return new SignatureResult
            {
                Success = false,
                AuditId = auditId,
                Status = WorkflowStatus.Failed,
                ErrorMessage = $"Document contains unredacted PII: {string.Join(", ", request.AiScanResult.PiiTypes)}",
                NextAction = "PII_REDACTION_REQUIRED"
            };
        }
        
        await _auditRepository.UpdateAiScanResultAsync(auditId, request.AiScanResult, ct);
        
        // ========================================
        // Step 3: Verify consent
        // ========================================
        if (!request.ConsentGiven)
        {
            return new SignatureResult
            {
                Success = false,
                AuditId = auditId,
                Status = WorkflowStatus.PendingApproval,
                ErrorMessage = "User consent is required for signature",
                NextAction = "CONSENT_REQUIRED"
            };
        }
        
        // ========================================
        // Step 4: Generate cryptographic signature
        // ========================================
        var signatureId = Guid.NewGuid();
        
        // Calculate document hash
        var documentHashBytes = Convert.FromHexString(request.Document.DocumentHash);
        
        // Sign with HSM
        var signatureBytes = await _hsmService.SignHashAsync(
            documentHashBytes,
            "signing-key-001", // Key ID from configuration
            ct);
        
        var signatureValue = Convert.ToBase64String(signatureBytes);
        
        // Complete the signature
        await _auditRepository.CompleteSignatureAsync(
            auditId,
            signatureId,
            signatureValue,
            request.Document.DocumentHash,
            ct);
        
        _logger.LogInformation(
            "AES signature completed for audit {AuditId}, signature {SignatureId}",
            auditId,
            signatureId);
        
        return new SignatureResult
        {
            Success = true,
            AuditId = auditId,
            SignatureId = signatureId,
            SignatureValue = signatureValue,
            Status = WorkflowStatus.Completed,
            SignedAt = DateTime.UtcNow
        };
    }

    #endregion

    #region MFA Operations

    /// <summary>
    /// Initiates MFA session for AES workflow
    /// </summary>
    public async Task<MfaSession> InitiateMfaSessionAsync(
        Guid auditId,
        SignerContext signer,
        CancellationToken ct = default)
    {
        var sessionId = Guid.NewGuid();
        var expiresAt = DateTime.UtcNow.AddMinutes(MfaSessionTimeoutMinutes);
        
        _logger.LogInformation(
            "Initiating MFA session {SessionId} for audit {AuditId}",
            sessionId,
            auditId);
        
        return new MfaSession
        {
            SessionId = sessionId,
            AuditId = auditId,
            CurrentStage = MfaStage.LdapPending,
            ExpiresAt = expiresAt
        };
    }

    /// <summary>
    /// Process LDAP authentication (MFA Layer 1)
    /// </summary>
    public async Task<MfaSession> ProcessLdapAuthenticationAsync(
        MfaSession session,
        string username,
        string password,
        CancellationToken ct = default)
    {
        _logger.LogInformation(
            "Processing LDAP authentication for session {SessionId}",
            session.SessionId);
        
        var (success, userDn, error) = await _ldapService.AuthenticateAsync(
            username, password, ct);
        
        await _auditRepository.UpdateMfaStatusAsync(
            session.AuditId,
            "LDAP",
            success,
            success ? $"UserDN: {userDn}" : error,
            ct);
        
        if (!success)
        {
            _logger.LogWarning(
                "LDAP authentication failed for session {SessionId}: {Error}",
                session.SessionId,
                error);
            
            return session with
            {
                CurrentStage = MfaStage.Failed
            };
        }
        
        return session with
        {
            CurrentStage = MfaStage.SmsPending,
            LdapCompleted = true,
            LdapCompletedAt = DateTime.UtcNow,
            LdapUserDn = userDn
        };
    }

    /// <summary>
    /// Send SMS OTP (MFA Layer 2 - Step 1)
    /// </summary>
    public async Task<(MfaSession Session, string MessageId)> SendSmsOtpAsync(
        MfaSession session,
        string phoneNumber,
        CancellationToken ct = default)
    {
        if (session.CurrentStage != MfaStage.SmsPending)
        {
            throw new InvalidOperationException(
                $"Cannot send SMS OTP in stage {session.CurrentStage}");
        }
        
        _logger.LogInformation(
            "Sending SMS OTP for session {SessionId}",
            session.SessionId);
        
        var (success, otpHash, messageId) = await _smsOtpService.SendOtpAsync(
            phoneNumber, ct);
        
        if (!success)
        {
            throw new InvalidOperationException("Failed to send SMS OTP");
        }
        
        return (session with
        {
            SmsOtpHash = otpHash
        }, messageId);
    }

    /// <summary>
    /// Verify SMS OTP (MFA Layer 2 - Step 2)
    /// </summary>
    public async Task<MfaSession> VerifySmsOtpAsync(
        MfaSession session,
        string inputOtp,
        CancellationToken ct = default)
    {
        if (session.SmsOtpHash == null)
        {
            throw new InvalidOperationException("OTP not sent for this session");
        }
        
        if (session.SmsAttempts >= MaxOtpAttempts)
        {
            _logger.LogWarning(
                "Max OTP attempts exceeded for session {SessionId}",
                session.SessionId);
            
            await _auditRepository.UpdateMfaStatusAsync(
                session.AuditId,
                "SMS",
                false,
                "Max attempts exceeded",
                ct);
            
            return session with
            {
                CurrentStage = MfaStage.Failed
            };
        }
        
        var verified = await _smsOtpService.VerifyOtpAsync(
            inputOtp, session.SmsOtpHash, ct);
        
        await _auditRepository.UpdateMfaStatusAsync(
            session.AuditId,
            "SMS",
            verified,
            verified ? "OTP verified" : $"Invalid OTP (attempt {session.SmsAttempts + 1})",
            ct);
        
        if (!verified)
        {
            return session with
            {
                SmsAttempts = session.SmsAttempts + 1
            };
        }
        
        _logger.LogInformation(
            "SMS OTP verified for session {SessionId}",
            session.SessionId);
        
        return session with
        {
            CurrentStage = MfaStage.BiometricPending,
            SmsCompleted = true,
            SmsCompletedAt = DateTime.UtcNow
        };
    }

    /// <summary>
    /// Generate WebAuthn challenge (MFA Layer 3 - Step 1)
    /// </summary>
    public async Task<(MfaSession Session, string Challenge)> GenerateWebAuthnChallengeAsync(
        MfaSession session,
        Guid userId,
        CancellationToken ct = default)
    {
        if (session.CurrentStage != MfaStage.BiometricPending)
        {
            throw new InvalidOperationException(
                $"Cannot generate WebAuthn challenge in stage {session.CurrentStage}");
        }
        
        var challenge = await _webAuthnService.GenerateChallengeAsync(userId, ct);
        
        _logger.LogInformation(
            "Generated WebAuthn challenge for session {SessionId}",
            session.SessionId);
        
        return (session, challenge);
    }

    /// <summary>
    /// Verify WebAuthn assertion (MFA Layer 3 - Step 2)
    /// </summary>
    public async Task<MfaSession> VerifyWebAuthnAsync(
        MfaSession session,
        Guid userId,
        string challenge,
        string clientDataJson,
        string authenticatorData,
        string signature,
        CancellationToken ct = default)
    {
        var (success, credentialId, method) = await _webAuthnService.VerifyAssertionAsync(
            userId, challenge, clientDataJson, authenticatorData, signature, ct);
        
        await _auditRepository.UpdateMfaStatusAsync(
            session.AuditId,
            "BIOMETRIC",
            success,
            success ? $"Method: {method}, CredentialId: {credentialId}" : "Verification failed",
            ct);
        
        if (!success)
        {
            _logger.LogWarning(
                "WebAuthn verification failed for session {SessionId}",
                session.SessionId);
            
            return session with
            {
                CurrentStage = MfaStage.Failed
            };
        }
        
        _logger.LogInformation(
            "WebAuthn verified for session {SessionId} using {Method}",
            session.SessionId,
            method);
        
        return session with
        {
            CurrentStage = MfaStage.AllCompleted,
            BiometricCompleted = true,
            BiometricCompletedAt = DateTime.UtcNow,
            BiometricMethod = method,
            WebAuthnCredentialId = credentialId
        };
    }

    /// <summary>
    /// Validate MFA session completeness
    /// </summary>
    private (bool IsValid, string? ErrorMessage, string? NextAction) ValidateMfaSession(
        MfaSession session)
    {
        // Check session expiry
        if (DateTime.UtcNow > session.ExpiresAt)
        {
            return (false, "MFA session has expired", "MFA_SESSION_EXPIRED");
        }
        
        // Check LDAP completion
        if (!session.LdapCompleted)
        {
            return (false, "LDAP authentication not completed", "LDAP_REQUIRED");
        }
        
        // Check SMS completion
        if (!session.SmsCompleted)
        {
            return (false, "SMS OTP verification not completed", "SMS_OTP_REQUIRED");
        }
        
        // Check biometric completion
        if (!session.BiometricCompleted)
        {
            return (false, "Biometric verification not completed", "BIOMETRIC_REQUIRED");
        }
        
        // All MFA layers completed
        if (session.CurrentStage != MfaStage.AllCompleted)
        {
            return (false, "MFA verification incomplete", "MFA_INCOMPLETE");
        }
        
        return (true, null, null);
    }

    #endregion

    #region AI PII Scanning

    /// <summary>
    /// Execute AI PII scan on document
    /// </summary>
    public async Task<AiScanContext> ExecuteAiPiiScanAsync(
        Guid documentId,
        byte[] documentBytes,
        CancellationToken ct = default)
    {
        _logger.LogInformation(
            "Executing AI PII scan for document {DocumentId}",
            documentId);
        
        var scanResult = await _aiScanner.ScanDocumentAsync(
            documentId, documentBytes, ct);
        
        _logger.LogInformation(
            "AI scan completed for document {DocumentId}. Result: {Result}, PII Found: {PiiFound}",
            documentId,
            scanResult.Result,
            scanResult.PiiFound);
        
        return scanResult;
    }

    #endregion

    #region Helper Methods

    /// <summary>
    /// Generate a simple electronic signature (hash-based)
    /// </summary>
    private static string GenerateSimpleSignature(
        string documentHash,
        Guid signerId,
        DateTime timestamp)
    {
        var signatureData = $"{documentHash}|{signerId}|{timestamp:O}";
        var signatureBytes = SHA256.HashData(Encoding.UTF8.GetBytes(signatureData));
        return Convert.ToBase64String(signatureBytes);
    }

    /// <summary>
    /// Compute SHA-512 hash of document bytes
    /// </summary>
    public static string ComputeDocumentHash(byte[] documentBytes)
    {
        var hashBytes = SHA512.HashData(documentBytes);
        return Convert.ToHexString(hashBytes).ToLowerInvariant();
    }

    #endregion
}

#region Extension Methods

/// <summary>
/// Service collection extensions for dependency injection
/// </summary>
public static class WorkflowServiceExtensions
{
    public static IServiceCollection AddSigningWorkflowServices(
        this IServiceCollection services)
    {
        services.AddScoped<WorkflowService>();
        // Add other service registrations here
        return services;
    }
}

#endregion
