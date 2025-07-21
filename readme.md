## Complaint Web Application
Install this repo either from the .zip or from the cli then run "npm run dev" edit .env.example to add your personal API keys

Built with vite and React, EmailJS and Cloudinary.

You will need :

"CLOUDINARY_CLOUD_NAME

CLOUDINARY_UPLOAD_PRESET

EMAILJS_SERVICE_ID

EMAILJS_TEMPLATE_ID

EMAILJS_PUBLIC_KEY" 

And an already existing email service (gmail or outlook for example)

For the sake of simplicity, account creation to use this app is currently stored in the client (user) cash within the browser,
Feel free to edit this with your own favourite database(MongoDB or Postgress for example)

Fully functional web app, compatible on both Desktop and mobile with PWA technology, feel free to test it.

It stores sent images on cloudinary and automatically links their URLs within the message,text is processed in emailJS
And sent only to the email of he who's intrested in receiving it (configure this in emailJS),
I also added an URL space to link and view already existing screenshots from other hosting sources (Dropbox or OneDrive for example) to reduce email-stress and spam messages.

<img width="1366" height="655" alt="image_1" src="https://github.com/user-attachments/assets/1feb029c-d1aa-4dc2-8aa4-1c3cb946d26f" />
<img width="1366" height="656" alt="image_0" src="https://github.com/user-attachments/assets/fcb0be9d-cfd1-4766-8412-e93aa09509b2" />
<img width="1366" height="656" alt="image" src="https://github.com/user-attachments/assets/eb045ffd-fb34-4a06-bbd5-ffa375118466" />
