
# Task Management Application

This is a simplified and modular version of the **Genflow-Task-Management** system. It focuses on the core **authentication flow**, designed using Angular 16+ for demonstration and internal review purposes.

---

## 🔁 Application Flow

1. **Login Page**: Validates email before enabling the password field and login button.
2. **OTP Verification**: Enter a 6-digit OTP to verify identity (mock flow).
3. **Forgot Password**: Reset password via OTP + new password.
4. **Dashboard Redirect**: On successful login, user is redirected (dashboard logic extendable).
5. **Route Protection**: Guard-based routing supported for future enhancements.

---

## 🔐 Demo User Credentials

Use the following to test the application:

**Admin Credentials**

- **Email**: `admin@genworx.ai`
- **Password**: `@Admin123`

---

**Team Lead Credentials:**

- **Email**: `mithiesoff@gmail.com`
- **Password**: `@Mithies2315`

---

**Team Member Credentials:**

- **Email**: `mithiesofficial@gmail.com`
- **Password**: `@Mithies2317`


If the user is created within the admin's user management part. We can login in to the user which was created.
**Remember the Email and Password** while creating the user in the user management page.

---

## 📁 Full Project Structure

```
├── Task-Management-Application/
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── src/
│   │   ├── index.html
│   │   ├── main.ts
│   │   ├── main.server.ts
│   │   ├── server.ts
│   │   ├── styles.css
│   │   ├── app/
│   │   │   ├── app.config.ts
│   │   │   ├── app.config.server.ts
│   │   │   ├── app.css
│   │   │   ├── app.html
│   │   │   ├── app.routes.ts
│   │   │   ├── app.routes.server.ts
│   │   │   ├── app.spec.ts
│   │   │   ├── app.ts
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   ├── forgot-password/
│   │   │   │   ├── otp-verification/
│   │   │   │   ├── set-new-password/
│   │   │   │   ├── signup/
│   │   │   ├── core/
│   │   │   │   ├── guard/
│   │   │   │   │   ├── auth/
│   │   │   │   │   ├── role/
│   │   │   │   ├── services/
│   │   │   │   │   ├── auth/
│   │   │   │   │   ├── confirmation-dialog/
│   │   │   │   │   ├── demo-data/
│   │   │   │   │   ├── local-storage/
│   │   │   │   │   ├── project/
│   │   │   │   │   ├── role/
│   │   │   │   │   ├── session-storage/
│   │   │   │   │   ├── task/
│   │   │   │   │   ├── team/
│   │   │   │   │   ├── toast/
│   │   │   │   │   ├── user/
│   │   │   ├── model/
│   │   │   │   ├── user.model.ts
│   │   │   ├── pages/
│   │   │   │   ├── admin/
│   │   │   │   │   ├── admin-dashbaord/
│   │   │   │   │   ├── admin-layout/
│   │   │   │   │   ├── content-management/
│   │   │   │   │   ├── help-center/
│   │   │   │   │   ├── performance-management/
│   │   │   │   │   ├── project-management/
│   │   │   │   │   ├── report-management/
│   │   │   │   │   ├── settings/
│   │   │   │   │   ├── sidebar/
│   │   │   │   │   ├── user-management/
│   │   │   │   ├── home/
│   │   │   │   │   ├── about/
│   │   │   │   │   ├── back-to-top/
│   │   │   │   │   ├── contact/
│   │   │   │   │   ├── features/
│   │   │   │   │   ├── footer/
│   │   │   │   │   ├── header/
│   │   │   │   │   ├── hero/
│   │   │   │   │   ├── home/
│   │   │   │   │   ├── impacts/
│   │   │   │   │   ├── testimonials/
│   │   │   │   ├── lead/
│   │   │   │   │   ├── backlogs/
│   │   │   │   │   ├── calendar/
│   │   │   │   │   ├── dashbaord/
│   │   │   │   │   ├── lead-layout/
│   │   │   │   │   ├── lead-profile/
│   │   │   │   │   ├── lead-settings/
│   │   │   │   │   ├── sidebar/
│   │   │   │   │   ├── tasks/
│   │   │   │   ├── member/
│   │   │   │   │   ├── calendar/
│   │   │   │   │   ├── dashbaord/
│   │   │   │   │   ├── member-layout/
│   │   │   │   │   ├── profile/
│   │   │   │   │   ├── reports/
│   │   │   │   │   ├── settings/
│   │   │   │   │   ├── sidebar/
│   │   │   │   │   ├── tasks/
│   │   │   │   ├── shared/
│   │   │   │   │   ├── confirmation-dialog/
│   │   │   │   │   ├── toast/
│   │   ├── environments/
│   │   │   ├── environment.development.ts/
│   │   │   ├── environment.ts/
│   │   ├── public/
│   │   │   ├── assets/
│   │   │   │   ├── user-images/
│   │   │   ├── logo/
```

---

## 🛠️ Setup Instructions

### 1. Extract the ZIP file
If you received this as a ZIP:

```bash
unzip Task-Management-Application.zip
cd Task-Management-Application
```

### 2. Install Node Modules

```bash
npm install
```

### 3. Start the Angular App

```bash
ng serve --open
```

The app will launch in your default browser at:

```
http://localhost:4200/
```

---

## ✅ Future Enhancements

- Add backend API support.
- Extend dashboard and user roles.
- Enable AuthGuard and RoleGuard in routing module.
- Add task management features using services and global state.

---

## 📬 Contact

For setup support or clarifications:

**Mithies**  
📧 [mithiesofficial@gmail.com]  
📱 [6383350764 || 6374624848]

---