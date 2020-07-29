# Harmony-Puzzle
Harmony Puzzle Game - Mobile Ver.

Requirement: 
+ Game Engine: Cocos Creator version 2.2.2 (https://www.cocos.com/en/creator/download)
			   Cocos Creator version 2.3.1
+ Java 8 SDK
+ Android NDK revision 19c (https://developer.android.com/ndk/downloads/older_releases)
+ Android Studio latest version

Steps to build APK
1. Open project in Cocos Creator. 
2. Open menu Project/Build, make sure [Platform] is [Android], then click [Build]
3. After build succeed, go to project folder /build/jsb-link
4. COPY 3 folers + 2 files: jsb-adapter | res | src | main.js | project.json
5. From project folder, open: new_android_project\app\src\main\assets, Remove all files & folder there + PASTE files/folder from step 4
6. From folder [new_android_project] Open file [settings.gradle], change value of [project(':libcocos2dx').projectDir]
	Point to Cocos 2.3.1 lib, for example on window:
	project(':libcocos2dx').projectDir = new File('C:/CocosCreator_2.3.1/resources/cocos2d-x/cocos/platform/android/libcocos2dx')
7. Use Android Studio, Open project new_android_project and build APK here
