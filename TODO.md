# TODO - Analytics, Notifications, Certificate Modules

## Phase 1: Analytics Dashboard
- [ ] Inspect existing frontend Analytics page and services.
- [ ] Check frontend chart dependencies (frontend/package.json) or implement lightweight graph.
- [x] Update Analytics.jsx to include:
  - [x] Average Score
  - [x] Highest Score
  - [x] Lowest Score
  - [x] Student Performance Graph
  - [x] Exam Statistics (per exam)


## Phase 2: Notification Module (Email)
- [ ] Review password reset email flow in backend/controllers/passwordResetController.js and frontend pages.
- [ ] Add email on result submission (backend/controllers/resultController.js).
- [ ] Add exam reminder mechanism (cron or admin-trigger endpoint).
- [ ] Add result published alert mechanism.
- [ ] Add required email templates/helper updates in backend/utils/email.js.

## Phase 3: Certificate Module
- [ ] Add Certificate model + storage fields (verificationNumber, pdfPath/metadata, userId, examId, resultId).
- [ ] Add certificate controller: generate, download PDF, verify endpoint.
- [ ] Add routes: certificateRoutes.js.
- [ ] Integrate certificate auto-generation after result submission.
- [ ] Add QR code verification logic.

## Testing
- [ ] Run backend and frontend.
- [ ] Validate analytics UI (all widgets render).
- [ ] Validate email sending (result + password reset).
- [ ] Validate certificate PDF download and QR verification.

