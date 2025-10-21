**WHAT IS CURRENTLY DEVELOPED ALREADY AND HOW IT WORKS(LOOK AT THE FILES IN GITHUB THIS DOESNT MENTION ALL OF THEM)**



server.js

	- Loads .env "process.env.MONGODB_URI, JWT_SECRET"
	- Connects Mongoose to MongoDB
	- Sets global middleware with helmet(), cors(), compression(), express.json({limit:"1mb"}), morgan()
	- Health endpoints: /healthz, /readyz
	- Mounts application router: "app.use("/api", api)"   //api is actually routes/index.js
	- Adds notFound(404) and errorHandler



routes/index.js

	- Basically acts like the hub and has these:

							const r = Router();

							r.use("/auth", auth);

							r.use("/users", users);

							r.use("/challenges", challenges);

 							r.use("/submissions", submissions);

 							export default r;

 	- These are basically different api handlings, they are organized by whats being HANDLED. Like for example when I r.use("/users", users); its going to use the

 	  user.routes.js which has r.get("/me", requireAuth, me); and r.get("/leaderboard", leaderboard);  which GRABS the api attributes from different files like

 	  middleware/auth.js and /controllers/users.controller.js . SO FAR index.js has chose the user route, its always going to be a \*something\*.routes.js file 

 	  first because its routing the attributes to other files, usually always in the middleware folder and in the controller folder but also sometimes in the

 	  validators folder.

 	- submissions.routes.js and users.routes.js grab /me from auth.js in middleware

 	- auth.routes.js grabs from validate.js in middleware, auth.schemas.js from validators, and auth.controller.js from controllers



middleware/auth.js

 	-  Grabs the JWT TOKEN with (req.headers.authorization || "").replace(/^Bearer\\s+/i, "");

 									^^^^^^^^^^^^^^^^^^^^^^^^



 	- This is needed when wanting to create or edit anything USER related and SUBMISSION related because they both access "/me"



middleware/validate.js

 	- Just validates parameters with   try { const parsed = schema.parse({ body: req.body, query: req.query, params: req.params }); the catch is error 400 Invalid request

 	- auth.routes.js uses validate like-> r.post("/register", **validate(registerSchema)**, register); and it does it with every r.post in there



validators/auth.schemas.js

 	- This file saves the schemas of endpoints in a struct type of way like in C, and looks like this for most endpoints



 		export const loginSchema = z.object({

  			body: z.object({

    				email: z.string().email(),

    				password: z.string().min(8)

  			})

 		});

 	- auth.routes.js uses the schema like a variable and puts it in the validate parameter like this r.post("/register", validate**(registerSchema)**, register);



controllers/auth.controller.js

 	- This file has the actual api functions that specifically require authorization

 	- The functions of these end up being used in the auth.routes.js file being passed into the r.post args like this r.post("/register", validate(registerSchema), **register**);

 	- **This file will need to be edited to send verification emails with nodemailer**







**WHAT NEEDS TO HAPPEN NEXT**





* nodemailer dependencies need to be installed in the server environment via npm i nodemailer (I will probably do this and let Daniel and Dylan know)
* the .env variables need to be updated with the EMAIL\_FROM variable and also all the SMTP vars need to be created like host, port, user, pass, secure
* also the APP\_BASE\_URL where the password reset link points to (btw the .env file is a .gitignore file and is inside the backend folder on the server. **DO NOT COMMIT THE .env FILE**)
* create a mail service file that imports nodemailer and includes all of our email functions
* once this is created you will need to edit auth.controller.js with email functions (I would create the email file and call it email.js and put it in the utils folder)
* if you have any questions hit me up on discord if I dont respond for a bit you can text me at 321-615-0233, for the most part I know how the nodemailer file should go, I also believe when this is done that will basically be all the API work we need to do unless we need to edit something for frontend





















