package one.harmony.puzzle.utils;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;

import com.samsung.android.sdk.coldwallet.ScwService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;

import one.harmony.puzzle.ethereum.KeyStoreManager;

public class Util {

    public static final String LOG_TAG = "Puzzle";
    private static int requiredAPILevel = 2;

    public static boolean isAPILevelMatched(Context context) {
        int APILevel = KeyStoreManager.getInstance(context).getKeystoreApiLevel();
        if (APILevel < requiredAPILevel) {
            Log.e(Util.LOG_TAG, "API Level is used is below required level");
            return false;
        } else {
            Log.i(Util.LOG_TAG, "API Level is used meets required level");
            return true;
        }
    }

    private static String getSupportedCoins(ScwService sbkInstance){
        int[] supportedCoins = sbkInstance.getSupportedCoins();

        StringBuilder sb = new StringBuilder();
        sb.append("Supported coins").append('\n');
        for (int i = 0; i < supportedCoins.length; i++ ) {
            sb.append('[').append(i).append("] ").append(supportedCoins[i]).append('\n');
        }

        String s = sb.toString();

        return s;
    }

    public static void launchDeepLink(Context context, String uriString) {
        Uri uri = Uri.parse(uriString);
        Intent displayIntent = new Intent(Intent.ACTION_VIEW, uri);
        displayIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(displayIntent);
    }

    public static ArrayList<String> stringToArrayList(String inputString) {
        return new ArrayList<>(Arrays.asList(inputString));
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
