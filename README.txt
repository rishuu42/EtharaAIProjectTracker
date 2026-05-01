ETHARA | PROJECT & TASK MANAGEMENT SYSTEM

This project was developed as a technical assignment for Ethara AI. It is a full-stack project and task management application designed to showcase a modern development workflow, premium UI/UX, and robust data management.

I focused heavily on creating a high-end experience using glassmorphism and smooth transitions, ensuring the interface feels premium and intuitive.

THE STORY BEHIND THE TECH
The app is built on Next.js 14 using the App Router. For the styling, I skipped the usual utility frameworks and went with Vanilla CSS to have total control over the look and feel. 

On the backend, I'm using Prisma to talk to a PostgreSQL database. It handles everything from user authentication (JWT + Bcrypt) to managing complex relationships between projects, team members, and tasks.

HOW IT'S HOSTED
I originally tried to host everything on Railway, but ended up going with a hybrid setup:
* The App: Hosted on Vercel because their Next.js support is hard to beat.
* The Database: Still running on Railway, which handles the PostgreSQL instance.

This setup keeps the site fast while keeping the database management simple.

FEATURES I BUILT
* Real Dashboard: Get a quick bird's-eye view of how many tasks are pending or completed.
* Team Access: It has full role-based access, meaning you can have Admins and regular Members with different permissions.
* Smooth Task Tracking: You can create projects, add members, and assign tasks with due dates and priorities.

GETTING STARTED LOCALLY
If you want to run this on your own machine:

1. Clone the repo and run npm install.
2. Set up your .env file with a DATABASE_URL and a JWT_SECRET.
3. Run npx prisma db push to set up the tables.
4. Run node prisma/seed.js to create the default admin account.
5. Launch with npm run dev.

ADMIN CREDENTIALS (DEFAULT):
* Email: admin@ethara.ai
* Password: admin123
