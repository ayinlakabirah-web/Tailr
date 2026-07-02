# Tailr – The Operating System for Small Fashion Businesses

Tagline: Run your entire fashion business from one place.

## 1. Product Overview
Tailr is a web-based operating system built specifically for small fashion businesses. It enables fashion entrepreneurs to manage customers, measurements, orders, payments, and deliveries from one centralized workspace.

Many fashion businesses currently operate using a combination of WhatsApp chats, notebooks, spreadsheets, and memory. While these methods may work initially, they become difficult to manage as the business grows, often leading to lost measurements, forgotten deadlines, payment disputes, and poor customer experiences.

Tailr replaces these fragmented processes with a single, easy-to-use platform that helps business owners stay organized, improve customer satisfaction, and scale their operations sustainably. Unlike generic business tools, Tailr is designed around the real workflow of fashion entrepreneurs. Tailr is not just a management tool; it is an operating system for running a fashion business.

## 2. Objectives
Tailr aims to solve operational inefficiencies experienced by small fashion businesses. The objectives are to:
- Centralize all business operations into one platform.
- Digitally store and retrieve customer measurements.
- Simplify order management from creation to delivery.
- Improve payment tracking and reduce disputes.
- Help vendors meet delivery deadlines consistently.
- Reduce dependency on WhatsApp as a business management tool.
- Help businesses become more professional and scalable.
- Allow business owners to focus more on creativity and customer relationships.

## 3. Target Users
### Primary Users
- Tailors
- Fashion designers
- Bespoke clothing vendors
- Ready-to-wear business owners
- Small fashion entrepreneurs

### User Characteristics
- **Non-technical users**: Most users have little to no technical background and need an intuitive platform.
- **Mobile-first users**: Many run their businesses primarily from their smartphones.
- **Small business owners**: Typically solo entrepreneurs or businesses with fewer than 10 employees.
- **Multi-taskers**: Users simultaneously manage customers, production, and deliveries.
- **Growing businesses**: Users are looking for better systems as their businesses expand.

## 4. Core Features (MVP)
### User Authentication
- Create accounts
- Log in securely
- Reset forgotten passwords

### Dashboard
- Total customers
- Active orders
- Pending deliveries
- Outstanding payments

### Customer Management
- Add customers
- Edit customer information
- Search customers
- View customer history

### Measurement Management
- Save measurements
- Edit measurements
- Retrieve previous measurements

### Order Management
- Create orders
- Assign orders to customers
- Track order progress
- Update order statuses (NEW, IN_PROGRESS, READY, DELIVERED)

### Payment Tracking
- Record deposits
- Track balances
- Update payment statuses (UNPAID, PARTIALLY_PAID, PAID)

### Delivery Tracking
- Set delivery dates
- Track delivery progress
- Mark orders as delivered

### Email Notifications
- Account verification
- Password reset requests
- Upcoming delivery reminders (future enhancement)

## 5. User Flows
### Business Setup Flow
Vendor → Create Account → Log In → Dashboard

### Customer Management Flow
Dashboard → Customers → Add Customer → Save Measurements → View Customer History

### Order Management Flow
Dashboard → Orders → Create New Order → Assign Customer → Set Delivery Date → Track Progress → Mark Delivered

### Payment Flow
Dashboard → Select Order → Record Deposit → Update Balance → Mark as Paid

## 6. Data Model
### User
- id, fullName, email, password, createdAt, updatedAt

### Customer
- id, fullName, phoneNumber, email (optional), address (optional), vendorId, createdAt, updatedAt

### Measurement
- id, customerId, shoulder, bust, waist, hip, sleeve, armhole, thigh, trouserLength, createdAt, updatedAt

### Order
- id, customerId, outfitType, quantity, specialInstructions, deliveryDate, status, createdAt, updatedAt

### Payment
- id, orderId, totalAmount, depositPaid, balanceRemaining, status, createdAt

### Delivery
- id, orderId, deliveryDate, status, deliveredAt

## 7. System Behavior
- Every account is unique.
- Every customer belongs to one vendor.
- Every customer can have multiple orders.
- Every order has one payment record.
- Every order has one delivery record.
- Dashboard statistics update automatically.
- Users cannot create incomplete orders.
- Users cannot assign orders to non-existent customers.
- Users can update measurements without creating duplicate records.

## 8. Notifications Logic
- **Account Verification**: Email to Vendor.
- **Password Reset**: Email to Vendor.
- **Upcoming Delivery Reminder** (Future): Email to Vendor.
- **Overdue Delivery** (Future): Dashboard notification + Email to Vendor.

## 9. Edge Cases
| Scenario | Response |
|---|---|
| Incorrect login credentials | Display clear error message |
| Order without customer | Prevent submission |
| Incomplete measurements | Highlight required fields |
| Past delivery date | Prevent submission |
| Delete customer with active orders | Restrict/block deletion |
| Duplicate customer detected | Suggest existing customer |
| Internet connection lost | Display connection error |

## 10. Security & Compliance
- Encrypt passwords before storage.
- Validate all user inputs server-side.
- Prevent unauthorized access (vendor-scoping).
- Protect against SQL injection (Prisma) and XSS (React escaping).
- Use HTTPS in production.
- Store sensitive information securely.

## 11. Market Intelligence & Positioning
Tailr is "The Operating System for Small Fashion Businesses". It is not a generic project management tool, CRM, or accounting software; it is built for the specific fashion workflow.

## 12. Technical Stack
- **Frontend**: Next.js (App Router), TypeScript, CSS
- **Backend**: Next.js Server Actions
- **Database**: PostgreSQL (Prisma ORM)
- **Email**: Nodemailer
- **Deployment**: Vercel

## 13. Success Metrics
- Fast customer/measurement creation and retrieval.
- Reduced missed deadlines.
- High daily active usage.

## 14. Product Roadmap
- **Phase 1 (MVP)**: Auth, Dashboard, Customers, Measurements, Orders, Payments, Deliveries.
- **Phase 2**: Delivery reminders, Dashboard notifications, Calendar view.
- **Phase 3**: Staff management, Appointment booking, Customer portal.
- **Phase 4**: Inventory, Fabric management, Expense tracking.
- **Phase 5**: AI assistant, Delivery predictions, Analytics.

## 15. Vision & Mission
**Vision**: To become the digital operating system that powers small fashion businesses across Africa.
**Mission**: To empower fashion entrepreneurs with simple digital tools that streamline operations and help them grow sustainable businesses.
