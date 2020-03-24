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

import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.Nullable;

import com.samsung.android.sdk.coldwallet.ScwCoinType;
import com.samsung.android.sdk.coldwallet.ScwService;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Hashtable;
import java.util.List;


public class AppActivity extends Cocos2dxActivity {

    static AppActivity currentContext;

    FakeBlockchainApi blockchainApi = new FakeBlockchainApi();

    private ScwService.ScwGetAddressListCallback mScwGetAddressListCallback;
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
            blockchainApi.init();

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

    public void getPublicAddress(String hdPath) {
        ScwService.getInstance().getAddressList(getSCWGetAddressListCallback(), stringToArrayList(hdPath));
    }

    public static ArrayList<String> stringToArrayList(String inputString) {
        return new ArrayList<String>(Arrays.asList(inputString));
    }

    private ScwService.ScwGetAddressListCallback getSCWGetAddressListCallback() {
        if (mScwGetAddressListCallback == null) {
            mScwGetAddressListCallback = new ScwService.ScwGetAddressListCallback() {
                @Override
                public void onSuccess(List<String> addressList) {
                    publicKey = addressList.get(0);
                }

                @Override
                public void onFailure(int i, @Nullable String s) {

                }
            };
        }

        return mScwGetAddressListCallback;
    }

    public String getSupportedCoins(){
        int[] supportedCoins = ScwService.getInstance().getSupportedCoins();

        StringBuilder sb = new StringBuilder();
        sb.append("Supported coins").append('\n');
        for (int i = 0; i < supportedCoins.length; i++ ) {
            sb.append('[').append(i).append("] ").append(supportedCoins[i]).append('\n');
        }

        String s = sb.toString();

        return s;
    }

    public boolean isKeystoreApiSupported() {
        int keystoreApiLevel = ScwService.getInstance().getKeystoreApiLevel();
        return keystoreApiLevel > 0;
    }

//    static SBlockchain mSblockchain;
//    private static final int VENDOR_NOT_SUPPORTED = -1;
//    public static void initBlockchain(){
//        try {
//            mSblockchain = new SBlockchain();
//            mSblockchain.initialize(currentContext);
//        } catch (SsdkUnsupportedException e) {
//            if (e.getErrorType() == VENDOR_NOT_SUPPORTED){
//                Log.e("error", "Platform SDK is not support this device");
//            }
//        }
//    }


    public static String getKeystore(){
        Log.i("Puzzle","Keystore: " + currentContext.publicKey);
        return currentContext.publicKey;
    }

    public static int getScore(String keycode){
        return currentContext.blockchainApi.getScoreByKeystore(keycode);
    }

    public static String getUserName(String keycode){
        return currentContext.blockchainApi.getUserNameByKeystore(keycode);
    }

    public static void updateScore(String keycode, int score){
        currentContext.blockchainApi.updateScore(keycode, score);
    }

    //    return [{
//        "garlam": 300,
//                "minh": 10
//
//    }]
    public static String getLeaderboard(){
        return currentContext.blockchainApi.getLeaderboard();
    }

    class Player {
        public String name;
        public String keycode;
        public int score;

        public Player(String name, String keycode, int score) {
            this.name = name;
            this.keycode = keycode;
            this.score = score;
        }
    }

    class FakeBlockchainApi {
        private Hashtable<String, Player> leaderboard = new Hashtable();

        public void init() {

            leaderboard.put("queen_keycode", new Player("Queen", "queen_keycode", 80));
            leaderboard.put("jack_keycode", new Player("Joker", "jack_keycode", 78));
            leaderboard.put("some_guy1", new Player("some guy 1", "some_guy1", 75));
            leaderboard.put("some_guy2", new Player("try harder", "some_guy2", 70));
            leaderboard.put("some_guy3", new Player("guy 3", "some_guy3", 66));
            leaderboard.put("some_guy4", new Player("random guy 4", "some_guy4", 55));
            leaderboard.put("some_guy5", new Player("some guy 5", "some_guy5", 44));
            leaderboard.put("some_guy6", new Player("guy 6", "some_guy6", 33));
            leaderboard.put("some_guy7", new Player("clone 7", "some_guy7", 22));
            leaderboard.put("some_guy8", new Player("guy 8", "some_guy8", 20));
            leaderboard.put("some_guy9", new Player("random guy 9", "some_guy9", 15));
        }

        public String getLeaderboard(){
            return leaderboard.toString();
        }

        public String getUserNameByKeystore(String keystore){
            if (leaderboard.containsKey(keystore)){
                return leaderboard.get(keystore).name;
            }

            return "";
        }

        public int getScoreByKeystore(String keystore){
            if (leaderboard.containsKey(keystore)){
                return leaderboard.get(keystore).score;
            }

            return 0;
        }

        public void updateScore(String keystore, int score){
            if (leaderboard.containsKey(keystore)){
                leaderboard.get(keystore).score = score;
            } else {
                leaderboard.put(keystore, new Player(keystore, keystore, score));
            }
        }
    }
}
