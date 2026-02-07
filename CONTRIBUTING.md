# Contributing to Business Wallet

**Version:** 1.0.0  
**Last Updated:** 2026-02-07  
**Status:** Active

This document defines the process standards for contributing to the Business Wallet project, including the Definition of Ready and Definition of Done checklists that must be satisfied for all issues and pull requests.

## Definition of Ready (DoR)

An issue is considered "Ready" when it meets all of the following criteria. Issues that are not Ready should not be started.

### Checklist

- [ ] **Clear Description:** The issue has a clear, unambiguous description of what needs to be accomplished
- [ ] **Acceptance Criteria:** Specific, testable acceptance criteria are defined (Given/When/Then format preferred)
- [ ] **Priority Assigned:** The issue has a priority level assigned (Critical, High, Medium, Low)
- [ ] **Size Estimated:** The issue has been estimated and is appropriately sized (can be completed within a single sprint/iteration)
- [ ] **Dependencies Identified:** Any blocking dependencies on other issues, external systems, or teams are identified and resolved or tracked
- [ ] **Technical Approach Understood:** The implementation approach is clear, or a spike has been completed to clarify it
- [ ] **API Contract Defined:** For features requiring API changes, the OpenAPI specification has been reviewed or drafted
- [ ] **Security Considerations Documented:** Any security implications have been identified and documented
- [ ] **Privacy Impact Assessed:** GDPR and privacy implications have been considered (data minimization, purpose limitation, data subject rights)
- [ ] **Multi-Tenancy Impact Assessed:** For SaaS features, tenant isolation requirements are understood
- [ ] **No Open Questions:** All clarifying questions have been answered; no blockers remain

### Additional Criteria for Specific Issue Types

#### New Features
- [ ] User story follows the format: "As a [role], I want [capability] so that [benefit]"
- [ ] UI mockups or wireframes provided (if applicable)
- [ ] Accessibility requirements specified (WCAG 2.1 Level AA compliance)

#### Bug Fixes
- [ ] Steps to reproduce are documented
- [ ] Expected vs. actual behavior is clearly described
- [ ] Environment and version information provided

#### Technical Debt / Refactoring
- [ ] Business justification provided
- [ ] Scope is clearly bounded
- [ ] Risk assessment completed

---

## Definition of Done (DoD)

An issue is considered "Done" when all of the following criteria are satisfied. Work should not be merged or released until it meets the Definition of Done.

### Code Quality Checklist

- [ ] **Code Implemented:** All acceptance criteria are implemented and verified
- [ ] **Code Review Passed:** Code has been reviewed by at least one other developer and all feedback addressed
- [ ] **TypeScript Standards Met:** Code follows TypeScript best practices:
  - No `any` types (use `unknown` if type is truly unknown)
  - No `@ts-ignore` or `@ts-expect-error` without detailed justification
  - Explicit types for function parameters and return values
  - Strict mode compliance
- [ ] **Coding Standards Followed:** Code follows project naming conventions and style guidelines
- [ ] **No New Warnings:** No new linter warnings or errors introduced

### Testing Checklist

- [ ] **Unit Tests Written:** Unit tests cover new business logic with meaningful assertions
- [ ] **Integration Tests Written:** Integration tests cover API endpoints (where applicable)
- [ ] **Tests Pass:** All existing and new tests pass
- [ ] **Test Coverage Maintained:** Test coverage has not decreased
- [ ] **Edge Cases Covered:** Edge cases and error conditions are tested

### Security Checklist

- [ ] **Security Scan Passed:** CodeQL or equivalent security scanning shows no new vulnerabilities
- [ ] **Input Validation:** All user inputs are validated and sanitized
- [ ] **Authentication/Authorization:** Proper authentication and authorization checks are in place
- [ ] **No Secrets in Code:** No credentials, API keys, or secrets are hardcoded
- [ ] **Audit Logging:** Security-relevant actions generate audit log entries

### Privacy & Compliance Checklist

- [ ] **GDPR Compliance:** Data handling follows GDPR requirements (data minimization, purpose limitation)
- [ ] **Tenant Isolation Verified:** Multi-tenant data isolation is maintained (no cross-tenant data access)
- [ ] **Selective Disclosure Supported:** Credential presentations support selective disclosure where applicable

### API Checklist (for API changes)

- [ ] **OpenAPI Specification Updated:** OpenAPI spec is updated to reflect changes
- [ ] **Backward Compatibility:** Breaking changes follow semantic versioning guidelines
- [ ] **Error Responses Consistent:** Error responses follow the standard format
- [ ] **API Documentation Updated:** API documentation reflects the changes

### Documentation Checklist

- [ ] **Code Comments:** Complex logic is documented with comments explaining "why"
- [ ] **README Updated:** Module README is updated if public interfaces change
- [ ] **Architecture Docs Updated:** architecture.md updated for architectural changes
- [ ] **Requirements Docs Updated:** requirements.md updated if requirements are added or modified

### Accessibility Checklist (for UI changes)

- [ ] **WCAG 2.1 AA Compliance:** UI changes meet accessibility standards
- [ ] **Keyboard Navigation:** All interactive elements are keyboard accessible
- [ ] **Screen Reader Support:** Appropriate ARIA labels are provided
- [ ] **Semantic HTML:** Semantic HTML elements are used

### Deployment Checklist

- [ ] **Environment Configuration:** Required environment variables are documented
- [ ] **Database Migrations:** Database migrations are tested and reversible
- [ ] **Feature Flags:** Feature flags are in place for gradual rollout (if applicable)
- [ ] **Observability:** Logging, tracing, and metrics are implemented

### Final Verification

- [ ] **Acceptance Criteria Met:** All acceptance criteria from the issue are satisfied
- [ ] **Product Owner Approval:** Changes have been reviewed and approved by product owner
- [ ] **No Regressions:** No regressions in existing functionality

---

## Issue Workflow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Backlog   │────▶│    Ready    │────▶│ In Progress │────▶│    Done     │
│             │     │   (DoR ✓)   │     │             │     │   (DoD ✓)   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                                       │
       │                                       │
       ▼                                       ▼
   Refinement                              Review &
   Required                                Testing
```

1. **Backlog:** Issue is captured but not yet refined
2. **Ready:** Issue meets Definition of Ready; can be pulled into a sprint
3. **In Progress:** Issue is actively being worked on
4. **Done:** Issue meets Definition of Done; can be released

---

## Quick Reference

### Before Starting Work
1. ✅ Verify the issue meets the Definition of Ready
2. ✅ Review existing documentation (architecture.md, requirements.md)
3. ✅ Understand module boundaries and dependencies
4. ✅ Check OpenAPI specifications for API contracts

### Before Submitting for Review
1. ✅ Run all tests locally and verify they pass
2. ✅ Run linters and fix any issues
3. ✅ Self-review your code changes
4. ✅ Update documentation as needed
5. ✅ Verify the Definition of Done checklist

### For Reviewers
1. ✅ Verify code quality and standards compliance
2. ✅ Check for security implications
3. ✅ Verify tenant isolation is maintained
4. ✅ Ensure tests are comprehensive
5. ✅ Validate documentation is updated

---

## References

- [Architecture Documentation](architecture.md)
- [Requirements Specification](requirements.md)
- [TypeScript Instructions](.github/instructions/typescript.instructions.md)
- [Copilot Instructions](.github/copilot-instructions.md)
