# thumbanail creator

creates thumbnail for 3d objects.  
currently only does .obj files  
should be possible to extend this for other types supported by babyonjs  

to use

1. copy all the 3d files to the "app/assets" folder.  
   all objects you want to thumbnail should be under this "assets" folder  
   any child folders will be ignored

2. run "app/la.bat"  
   this will create a file called "assets.js"  
   This should now contain an array of all ".obj" files in the "assets" folder  

3. run the babylonjs application.

   make sure the node_modules have all been installed.
   if not use "npm install" to do so.  
   
   to run - "npm run app"  

   This will open the browser with the app running in it  
   It will read the "assets.js" and load the first object in the scene  
   Position the object properly.  
   Use mouse to rotate around object  
   Use mouse wheel button to zoom in or out  
   Use mouse right button to pan  
   click the "ScreenShot" button.  
   You will be promoted for a folder name  
   Choose the "assets" folder.  
   The screenshot will be saved as <obj file name>.obj.png  
  
   Click next or prev button to load the next object and repeat above until done.  
   You don't have to adjust camera for each object. The previous settings are retained.  

4. run "u.bat" file.  
   This will scan the "asset" folder for all files.  
   It will create a folder for each filename and move all files with that filename to that folder.  
