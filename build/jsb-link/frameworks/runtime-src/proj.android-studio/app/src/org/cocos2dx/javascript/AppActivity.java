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
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.Nullable;

import com.samsung.android.sdk.coldwallet.ScwCoinType;
import com.samsung.android.sdk.coldwallet.ScwDeepLink;
import com.samsung.android.sdk.coldwallet.ScwService;

import org.cocos2dx.javascript.sample.NodeConnector;
import org.cocos2dx.javascript.sample.SharedPreferenceManager;
import org.cocos2dx.javascript.sample.TransactionViewModel;
import org.cocos2dx.javascript.sample.Util;
import org.cocos2dx.javascript.service.LeaderBoard;
import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.RawTransaction;
import org.web3j.crypto.TransactionEncoder;
import org.web3j.crypto.WalletUtils;
import org.web3j.tx.ChainId;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


public class AppActivity extends Cocos2dxActivity {

    static AppActivity currentContext;

    LeaderBoard leaderboard = new LeaderBoard();

    private ScwService.ScwGetAddressListCallback mScwGetAddressListCallback;
    public String publicKey = "";

    private static final String CREDENTIAL_DIR = ".credentials";
    private static final String CREDENTIAL_FILE_PATH_KEY = "credential_key";
    private static final String HARD_CODED_PASSWORD = "PASSWORD";
    private Credentials mCredential;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (!isTaskRoot()) {
            return;
        }
        // DO OTHER INITIALIZATION BELOW
        SDKWrapper.getInstance().init(this);

        currentContext = this;

        if (isKeystoreApiSupported()) {
            leaderboard.init();

            if (isWalletInitialized()) {
                String ethereumHdPath = ScwService.getHdPath(ScwCoinType.ETH, 0);

                String supportedCoins = getSupportedCoins();
                Log.i("Harmony - coins", supportedCoins);
                Log.i("Harmony - ethereumHdPath", ethereumHdPath);

                getPublicAddress(ethereumHdPath);
            }
        }
    }

    public Credentials getCredential() throws Exception{
        if(mCredential==null){
            final String CREDENTIAL_PATH = currentContext.getFilesDir() + "/" + CREDENTIAL_DIR;;
            File credentialDir = new File(CREDENTIAL_PATH);
            if(!credentialDir.exists()){
                boolean result = credentialDir.mkdir();
                if(!result){
                    throw new Exception("Cannot make dir");
                }
            }

            String credentialFilename = SharedPreferenceManager.getCredentialFilePath(currentContext, CREDENTIAL_FILE_PATH_KEY);
            if(credentialFilename==null){
                // need to make
                credentialFilename = WalletUtils.generateNewWalletFile(HARD_CODED_PASSWORD, credentialDir, false);
                SharedPreferenceManager.setCredentialFilePath(currentContext, CREDENTIAL_FILE_PATH_KEY, credentialFilename);
            }
            mCredential = WalletUtils.loadCredentials(HARD_CODED_PASSWORD, CREDENTIAL_PATH + "/" + credentialFilename);
        }
        return mCredential;
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
        String seedHash = ScwService.getInstance().getSeedHash();
        boolean initialized =  (seedHash != null && seedHash.length() > 0);

        return initialized;
    }

    private static void checkForUpdateThenSignTransaction(){
        ScwService.ScwCheckForMandatoryAppUpdateCallback callback =
                new ScwService.ScwCheckForMandatoryAppUpdateCallback() {
                    @Override
                    public void onMandatoryAppUpdateNeeded(boolean needed) {
                        if(needed){
                            startDeepLink(ScwDeepLink.GALAXY_STORE);
                        } else {
                            signEthTransaction();
                        }
                    }
                };

        ScwService.getInstance().checkForMandatoryAppUpdate(callback);
    }

    private void getPublicAddress(String hdPath) {
        ScwService.getInstance().getAddressList(getSCWGetAddressListCallback(), stringToArrayList(hdPath));
    }

    // SIGN TRANSACTION
    private static void signEthTransaction(){
        String ethereumHdPath = ScwService.getHdPath(ScwCoinType.ETH, 0);

        String myAddress = currentContext.publicKey;
        String toAddress = "0x2700E87Bf9A7A7D015eE50AaAB47936e3043cefe";
        String ethAmount = "0.05";
        String data = "";
        String speed = "average"; // slow | average | fast

        byte[] encodedUnsignedEthTx = createRawTransaction(toAddress, ethAmount, data);

        //ScwService.getInstance().signEthTransaction(getSCWSignEthTransactionCallback(), encodedUnsignedEthTx, ethereumHdPath);

        TransactionViewModel.createAndSignTransaction(currentContext, toAddress, ethAmount, speed);
    }

    public void signTransaction( byte[] encodedUnsignedEthTx){
        String ethereumHdPath = ScwService.getHdPath(ScwCoinType.ETH, 0);

        ScwService.getInstance().signEthTransaction(getSCWSignEthTransactionCallback(), encodedUnsignedEthTx, ethereumHdPath);
    }

    public void signEthTransactionWithWeb3j(RawTransaction rawTransaction) {
        Log.i(Util.LOG_TAG, "Init Web3j to sign transaction");

        String network = SharedPreferenceManager.getDefaultNetwork(currentContext);
        byte chainId = -1;
        if(NodeConnector.ROPSTEN.equals(network)) {
            chainId = 3;
        } else if(NodeConnector.KOVAN.equals(network)) {
            chainId = 42;
        } else if(NodeConnector.MAINNET.equals(network)) {
            chainId = 1;
        }

        byte[] signedMessage;

        try {
            if (chainId > ChainId.NONE) {
                signedMessage = TransactionEncoder.signMessage(rawTransaction, chainId, mCredential);
            } else {
                signedMessage = TransactionEncoder.signMessage(rawTransaction, mCredential);
            }

            TransactionViewModel.setSignedTransaction(signedMessage);

            Log.i(Util.LOG_TAG, "Success signMessage with web3j");

        } catch (Exception e) {
            Log.i(Util.LOG_TAG, "Exception when signMessage with web3j. message : " + e.getMessage());
        }
    }

    private static ScwService.ScwSignEthTransactionCallback getSCWSignEthTransactionCallback() {
        return new ScwService.ScwSignEthTransactionCallback() {
            @Override
            public void onSuccess(byte[] signedEthTransaction) {
                //showAlertDialog("Sign Transaction successful!");
                Toast.makeText(currentContext,"Sign Transaction successful!", Toast.LENGTH_LONG);
            }

            @Override
            public void onFailure(int errorCode, @Nullable String errorMessage) {
                //showAlertDialog("FAILED to Sign Transaction, errorCode: " + errorCode + " errorMessage: " + errorMessage);
                //ScwErrorCode.ERROR_INVALID_TRANSACTION_FORMAT == -16;

                Toast.makeText(currentContext,"FAILED to Sign Transaction, errorCode: " + errorCode + " errorMessage: " + errorMessage, Toast.LENGTH_LONG);
            }
        };
    }

    private static byte[] createRawTransaction(String toAddress, String ethAmount, String extraInfo){
        // ["cat", "dog"]
        return new byte[]{50, 50, 50, 50 ,50};
    }
    // *********

    private static ArrayList<String> stringToArrayList(String inputString) {
        return new ArrayList<>(Arrays.asList(inputString));
    }

    private ScwService.ScwGetAddressListCallback getSCWGetAddressListCallback() {
        if (mScwGetAddressListCallback == null) {
            mScwGetAddressListCallback = new ScwService.ScwGetAddressListCallback() {
                @Override
                public void onSuccess(List<String> addressList) {
                    publicKey = addressList.get(0);

                    int currentScore = currentContext.leaderboard.getScoreByKeystore(publicKey);

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

    private String getSupportedCoins(){
        int[] supportedCoins = ScwService.getInstance().getSupportedCoins();

        StringBuilder sb = new StringBuilder();
        sb.append("Supported coins").append('\n');
        for (int i = 0; i < supportedCoins.length; i++ ) {
            sb.append('[').append(i).append("] ").append(supportedCoins[i]).append('\n');
        }

        String s = sb.toString();

        return s;
    }

    private boolean isKeystoreApiSupported() {
        int keystoreApiLevel = ScwService.getInstance().getKeystoreApiLevel();
        return keystoreApiLevel > 0;
    }

    // PUBLIC API for Android Game
    public static String getKeystore(){
        Log.i("Puzzle","Keystore: " + currentContext.publicKey);
        return currentContext.publicKey;
    }

    public static int getScore(){
        return currentContext.leaderboard.getScoreByKeystore(currentContext.publicKey);
    }

    public static void updateScore(int score){
        currentContext.leaderboard.updateScore(currentContext.publicKey, score);

        //signEthTransaction();
        checkForUpdateThenSignTransaction();
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
    public static void gotoSamsungBlockchainKeystoreMenu(){
        startDeepLink(ScwDeepLink.MAIN);
    }

    private static void startDeepLink(String deepLink){
        Uri uri = Uri.parse(deepLink);
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setData(uri);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        currentContext.startActivity(intent);
    }
}
