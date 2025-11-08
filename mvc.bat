@echo off
echo Creating Node.js MVC API folder structure...

REM Root folders
mkdir config
mkdir controllers
mkdir models
mkdir routes
mkdir middleware
mkdir services
mkdir utils
mkdir public
mkdir public\uploads

REM Sample files
echo // Database config > config\db.js
echo // App config > config\config.js

echo // Controllers > controllers\userController.js
echo // Controllers > controllers\authController.js
echo // Controllers > controllers\postController.js

echo // Models > models\User.js
echo // Models > models\Post.js

echo // Routes > routes\userRoutes.js
echo // Routes > routes\authRoutes.js
echo // Routes > routes\postRoutes.js
echo // Combine all route files > routes\index.js

echo // Middleware > middleware\authMiddleware.js
echo // Middleware > middleware\errorHandler.js
echo // Middleware > middleware\validateRequest.js

echo // Services > services\userService.js
echo // Services > services\authService.js
echo // Services > services\emailService.js

echo // Utils > utils\logger.js
echo // Utils > utils\jwt.js
echo // Utils > utils\helpers.js

echo Structure created successfully!
pause
