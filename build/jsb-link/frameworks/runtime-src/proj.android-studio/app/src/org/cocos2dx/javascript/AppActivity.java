/****************************************************************************
 Copyright (c) 2015-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
package org.cocos2dx.javascript;

import android.app.AlertDialog;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.Nullable;

import com.samsung.android.sdk.coldwallet.ScwCoinType;
import com.samsung.android.sdk.coldwallet.ScwDeepLink;
import com.samsung.android.sdk.coldwallet.ScwService;

import org.cocos2dx.javascript.sample.TransactionViewModel;
import org.cocos2dx.javascript.service.LeaderBoard;
import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;

import java.util.List;

import static org.cocos2dx.javascript.Util.stringToArrayList;


public class AppActivity extends Cocos2dxActivity {

    static AppActivity currentContext;

    ScwService SbkInstance;

    LeaderBoard leaderboard = new LeaderBoard();

    private ScwService.ScwGetAddressListCallback mScwGetAddressListCallback;
    public String publicKey = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (!isTaskRoot()) {
            return;
        }
        // DO OTHER INITIALIZATION BELOW
        SDKWrapper.getInstance().init(this);

        currentContext = this;

        SbkInstance = ScwService.getInstance();

        if (isDeviceSupportsSBK() == false) {
            showAlertDialog("Your Device is not support Samsung Blockchain");
            return;
        }
        if (checkApiLevel() == false) {
            showAlertDialog("Samsung Blockchain API level is outdated, please upgrade.");
            return;
        }

        leaderboard.init();

        if (isWalletInitialized()) {
            String ethereumHdPath = ScwService.getHdPath(ScwCoinType.ETH, 0);

            getPublicAddress(ethereumHdPath);
        }
    }

    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);
        SDKWrapper.getInstance().setGLSurfaceView(glSurfaceView, this);

        return glSurfaceView;
    }

    @Override
    protected void onResume() {
        super.onResume();
        SDKWrapper.getInstance().onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        SDKWrapper.getInstance().onPause();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        SDKWrapper.getInstance().onDestroy();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        SDKWrapper.getInstance().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        SDKWrapper.getInstance().onNewIntent(intent);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        SDKWrapper.getInstance().onRestart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        SDKWrapper.getInstance().onStop();
    }

    @Override
    public void onBackPressed() {
        SDKWrapper.getInstance().onBackPressed();
        super.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        SDKWrapper.getInstance().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        SDKWrapper.getInstance().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        SDKWrapper.getInstance().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        SDKWrapper.getInstance().onStart();
        super.onStart();
    }

    /// BLOCKCHAIN Code
    private boolean isWalletInitialized(){
        String seedHash = SbkInstance.getSeedHash();
        boolean initialized =  (seedHash != null && seedHash.length() > 0);

        return initialized;
    }

    private static void checkForUpdateThenSignTransaction(){
        ScwService.ScwCheckForMandatoryAppUpdateCallback callback =
                new ScwService.ScwCheckForMandatoryAppUpdateCallback() {
                    @Override
                    public void onMandatoryAppUpdateNeeded(boolean needed) {
                        if(needed){
                            Util.launchDeepLink(currentContext, ScwDeepLink.GALAXY_STORE);
                        } else {
                            signEthTransaction();
                        }
                    }
                };

        currentContext.SbkInstance.checkForMandatoryAppUpdate(callback);
    }

    private void getPublicAddress(String hdPath) {
        SbkInstance.getAddressList(getSCWGetAddressListCallback(), stringToArrayList(hdPath));
    }

    // SIGN TRANSACTION
    private static void signEthTransaction(){
        String toAddress = "0x2700E87Bf9A7A7D015eE50AaAB47936e3043cefe";
        String ethAmount = "0.05";
        String speed = "average"; // slow | average | fast

        TransactionViewModel.createAndSignTransaction(currentContext, toAddress, ethAmount, speed);
    }

    public void signTransaction( byte[] unsignedTransaction){
        Log.i(Util.LOG_TAG, "Init SBK to sign transaction");
        if (isSBKSupported()) {
            String ethereumHdPath = ScwService.getHdPath(ScwCoinType.ETH, 0);
            SbkInstance.signEthTransaction(getSCWSignEthTransactionCallback(), unsignedTransaction, ethereumHdPath);
        }
    }

    private ScwService.ScwSignEthTransactionCallback getSCWSignEthTransactionCallback() {
        return new ScwService.ScwSignEthTransactionCallback() {
            @Override
            public void onSuccess(byte[] signedEthTransaction) {
                //showAlertDialog("Sign Transaction successful!");
                //Toast.makeText(currentContext,"Sign Transaction successful!", Toast.LENGTH_LONG);
                Log.i(Util.LOG_TAG, "Sign Transaction successful!");

                // Set content before sending
                TransactionViewModel.setSignedTransaction(signedEthTransaction);

                // SEND TRANSACTION
                TransactionViewModel.sendTransaction(currentContext);
            }

            @Override
            public void onFailure(int errorCode, @Nullable String errorMessage) {
                //showAlertDialog("FAILED to Sign Transaction, errorCode: " + errorCode + " errorMessage: " + errorMessage);
                //ScwErrorCode.ERROR_INVALID_TRANSACTION_FORMAT == -16;

                Log.i(Util.LOG_TAG, "FAILED to Sign Transaction, errorCode: " + errorCode + " errorMessage: " + errorMessage);

                //Toast.makeText(currentContext,"FAILED to Sign Transaction, errorCode: " + errorCode + " errorMessage: " + errorMessage, Toast.LENGTH_LONG);
            }
        };
    }

    // *********
    private ScwService.ScwGetAddressListCallback getSCWGetAddressListCallback() {
        if (mScwGetAddressListCallback == null) {
            mScwGetAddressListCallback = new ScwService.ScwGetAddressListCallback() {
                @Override
                public void onSuccess(List<String> addressList) {
                    publicKey = addressList.get(0);

                    int currentScore = leaderboard.getScoreByKeystore(publicKey);

                    // this account never save score, or this is new player
                    if (currentScore == 0) {
                        leaderboard.updateScore(publicKey, 0);
                    }
                }

                @Override
                public void onFailure(int i, @Nullable String s) {

                }
            };
        }

        return mScwGetAddressListCallback;
    }

    public boolean isSBKSupported() {
        if (SbkInstance == null) {
            Log.e(Util.LOG_TAG, "SBK is Not Supported on Device");
            return false;
        } else {
            return true;
        }
    }

    private boolean checkApiLevel() {
        int keystoreApiLevel = SbkInstance.getKeystoreApiLevel();
        return keystoreApiLevel > 0;
    }

    // PUBLIC API for Android Game
    public static String getKeystore(){
        Log.i(Util.LOG_TAG,"Keystore: " + currentContext.publicKey);
        return currentContext.publicKey;
    }

    public static int getScore(){
        return currentContext.leaderboard.getScoreByKeystore(currentContext.publicKey);
    }

    public static void updateScore(int score){
        if (Util.isInternetConnectionAvailable()){
            currentContext.leaderboard.updateScore(currentContext.publicKey, score);

            checkForUpdateThenSignTransaction();
        }
        else {
            showAlertDialog("No Internet connection available.\n Unable to save your score!");
        }
    }

    public static String getLeaderboard(){
        return currentContext.leaderboard.getLeaderBoard();
    }

    public static void showAlertDialog(final String message) {
        //we must use runOnUiThread here
        currentContext.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                AlertDialog alertDialog = new AlertDialog.Builder(currentContext).create();
                alertDialog.setTitle("Message");
                alertDialog.setMessage(message);
                //alertDialog.setIcon(R.drawable.ic_close);
                alertDialog.show();
            }
        });
    }

    // Don't remove, this is an api
    public static void gotoSamsungBlockchainKeystoreMenu()
    {
        Util.launchDeepLink(currentContext, ScwDeepLink.MAIN);
    }

    public static boolean isDeviceSupportsSBK(){
        return currentContext.SbkInstance == null;
    }
}
