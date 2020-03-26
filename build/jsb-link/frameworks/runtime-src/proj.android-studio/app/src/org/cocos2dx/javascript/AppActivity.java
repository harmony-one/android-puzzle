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

import androidx.annotation.Nullable;

import com.google.gson.Gson;
import com.samsung.android.sdk.coldwallet.ScwCoinType;
import com.samsung.android.sdk.coldwallet.ScwDeepLink;
import com.samsung.android.sdk.coldwallet.ScwService;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;


public class AppActivity extends Cocos2dxActivity {

    static AppActivity currentContext;

    LeaderBoard leaderboard = new LeaderBoard();

    private ScwService.ScwGetAddressListCallback mScwGetAddressListCallback;
    private ScwService.ScwSignEthTransactionCallback mScwSignEthTransactionCallback;
    String publicKey = "";


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

    private void getPublicAddress(String hdPath) {
        ScwService.getInstance().getAddressList(getSCWGetAddressListCallback(), stringToArrayList(hdPath));
    }

    private void signEthTransaction(String hdPath){
        String myAddress = currentContext.publicKey;
        String toAddress = "0xe7425ee1bc64ab7c51ce3617cb83e76fd545f1a9"; // Example
        String ethAmount = "123.456";
        String data = "extra info";

        byte[] encodedUnsignedEthTx = createRawTransaction(toAddress, ethAmount, data);

        ScwService.getInstance().signEthTransaction(getSCWSignEthTransactionCallback(), encodedUnsignedEthTx, hdPath);
    }

    private byte[] createRawTransaction(String toAddress, String ethAmount, String extraInfo){
        return new byte[0];
    }

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

                    // this account never save score, or new player
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

    private ScwService.ScwSignEthTransactionCallback getSCWSignEthTransactionCallback() {
        if (mScwSignEthTransactionCallback == null) {
            mScwSignEthTransactionCallback = new ScwService.ScwSignEthTransactionCallback() {
                @Override
                public void onSuccess(byte[] bytes) {
                    Log.i("Puzzle", "Signing Successful!");
                }

                @Override
                public void onFailure(int i, @Nullable String s) {

                }
            };
        }

        return mScwSignEthTransactionCallback;
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

    public static void gotoSamsungBlockchainKeystoreMenu(){
        Uri uri = Uri.parse(ScwDeepLink.MAIN);
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setData(uri);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        currentContext.startActivity(intent);
    }

    class Entry implements Comparable{
        public String key;
        public int score;

        public Entry(String key, int score) {
            this.key = key;
            this.score = score;
        }

        @Override
        public int compareTo(Object compareTo) {
            int scoreToCompare = ((Entry)compareTo).score;

            return scoreToCompare - this.score; // big first
        }
    }

    // Leader board Api
    class LeaderBoard {
        private List<Entry> _list;

        Gson gson = new Gson();

        public void init() {
             _list = new ArrayList<>();


            _list.add(new Entry("0xe7125ee1bc64ab7c51ce3617cb83e76fd545f1a9", 80));
            _list.add(new Entry("0xe8425ee1bc64ab7c51ce3617cb83e76fd545f1b0", 78));
            _list.add(new Entry("0xe9325ee1bc64ab7c51ce3617cb83e76fd545f1c1", 75));
            _list.add(new Entry("0xe6625ee1bc64ab7c51ce3617cb83e76fd545f1d2", 70));
            _list.add(new Entry("0xe5e25ee1bc64ab7c51ce3617cb83e76fd545f1e3", 90));
            _list.add(new Entry("0xe4325ee1bc64ab7c51ce3617cb83e76fd545f1f4", 55));
            _list.add(new Entry("0xe2325ee1bc64ab7c51ce3617cb83e76fd545f1a5", 44));
            _list.add(new Entry("0xe5425ee1bc64ab7c51ce3617cb83e76fd545f1b6", 33));
            _list.add(new Entry("0xe1225ee1bc64ab7c51ce3617cb83e76fd545f1c7", 200));
            _list.add(new Entry("0xe5d25ee1bc64ab7c51ce3617cb83e76fd545f1d8", 20));
            _list.add(new Entry("0xe6a25ee1bc64ab7c51ce3617cb83e76fd545f1e9", 150));

            Collections.sort(_list);
        }

        public String getLeaderBoard(){
            String json = gson.toJson(_list);
            Log.i("puzzle", json);
            return json;
        }

        public int getScoreByKeystore(String keystore){
            for (Entry entry: _list) {
                if(entry.key == keystore) return entry.score;
            }

            return 0;
        }

        public void updateScore(String keystore, int score){
            for (Entry entry: _list) {
                if(entry.key == keystore) {
                    if (score > entry.score) {
                        entry.score = score;

                        Collections.sort(_list);
                        break;
                    }
                }
            }
        }
    }
}
