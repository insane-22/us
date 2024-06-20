# us🤝

## Overview

Us is a social media application, that allows people to talk to maintain their social presence digitally. It allows users to post pictures or simple text about something and follow others. It also allows forming of communities where one can connect to similar-minded people.

## Features
- Authentication using NextAuth and Google provider.
- File upload feature using uploadthing to allow easy uploads of files
- Chat with followers and people who are following 
- Pusher to have realtime chat function

## Tech stack
Nextjs, Tailwind CSS, Shadcn components, Prisma, Postgresql, NextAuth, Zod, Pusher, Cloudthing 

## Getting Started
- Clone this repo: `git clone https://github.com/insane-22/us.git`
- Run `npm install` to install dependencies
- Make a .env file and copy these environment variables there

```bash
DATABASE_URL=
DIRECT_URL=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_SECRET=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
PUSHER_APP_ID=
NEXT_PUBLIC_PUSHER_APP_KEY=
PUSHER_SECRET=
```