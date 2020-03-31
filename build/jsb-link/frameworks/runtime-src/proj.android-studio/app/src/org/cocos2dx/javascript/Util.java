package org.cocos2dx.javascript;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.journeyapps.barcodescanner.BarcodeEncoder;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;

public class Util {

    public static final String LOG_TAG = "Puzzle";
    private static int qrCodeWidth = 10;
    private static int qrCodeHeight = 10;
    private static int requiredAPILevel = 2;

    public static boolean isAPILevelMatched(Context context) {
//        int APILevel = KeyStoreManager.getInstance(context).getKeystoreApiLevel();
//        if (APILevel < requiredAPILevel) {
//            Log.e(Util.LOG_TAG, "API Level is used is below required level");
//            return false;
//        } else {
//            Log.i(Util.LOG_TAG, "API Level is used meets required level");
//            return true;
//        }
        return true;
    }

    public static void launchDeepLink(Context context, String uriString) {
        Uri uri = Uri.parse(uriString);
        Intent displayIntent = new Intent(Intent.ACTION_VIEW, uri);
        displayIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(displayIntent);
    }

    public static ArrayList<String> stringToArrayList(String inputString) {
        return new ArrayList<String>(Arrays.asList(inputString));
    }

    public static Bitmap generateQRCode(String text) {
        MultiFormatWriter multiFormatWriter = new MultiFormatWriter();
        Bitmap bitmap = Bitmap.createBitmap(qrCodeWidth, qrCodeHeight, Bitmap.Config.RGB_565);
        try {
            BitMatrix bitMatrix = multiFormatWriter.encode(text, BarcodeFormat.QR_CODE, 1000, 1000);
            BarcodeEncoder barcodeEncoder = new BarcodeEncoder();
            bitmap = barcodeEncoder.createBitmap(bitMatrix);
        } catch (WriterException e) {
            e.printStackTrace();
        } finally {
            return bitmap;
        }
    }

    public static boolean isInternetConnectionAvailable() {
        Runtime runtime = Runtime.getRuntime();
        try {
            Process ipProcess = runtime.exec("/system/bin/ping -c 1 8.8.8.8");  // ping Google Public DNS
            int exitValue = ipProcess.waitFor();
            return (exitValue == 0);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return false;
    }

}
