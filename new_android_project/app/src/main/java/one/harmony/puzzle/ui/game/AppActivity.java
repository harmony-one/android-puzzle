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
package one.harmony.puzzle.ui.game;

import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.Nullable;

import com.samsung.android.sdk.coldwallet.ScwCoinType;
import com.samsung.android.sdk.coldwallet.ScwDeepLink;
import com.samsung.android.sdk.coldwallet.ScwService;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;

import java.math.BigInteger;
import java.util.List;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.observers.DisposableObserver;
import io.reactivex.schedulers.Schedulers;
import one.harmony.puzzle.ethereum.KeyStoreManager;
import one.harmony.puzzle.ethereum.NodeConnector;
import one.harmony.puzzle.ethereum.WalletService;
import one.harmony.puzzle.utils.Util;

public class AppActivity extends Cocos2dxActivity {

    private static final String TAG = AppActivity.class.getSimpleName();

    static AppActivity currentContext;

    ScwService SbkInstance;
    private ScwService.ScwGetAddressListCallback mScwGetAddressListCallback;

    private CompositeDisposable mCompositeDisposable;
    private static WalletService walletService;

    public static String publicAddress = "";

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

        // Check if SBK is supported on the device or not
        if (!KeyStoreManager.getInstance(this).isSBKSupported()) {
            Log.d(Util.LOG_TAG, "SBK is not supported on Device");
            return;
        }
        // Check if required API level is not matched
        if (!Util.isAPILevelMatched(this)) {
            Log.d(Util.LOG_TAG, "SBK update required.");
            return;
        }

        // Check if SBK Wallet is set
        if (!KeyStoreManager.getInstance(this).isSBKWalletSet()) {
            Log.d(Util.LOG_TAG, "SBK wallet not set. Need to jump to SBK to create a wallet");
            return;
        }

        initParam();

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
        NodeConnector.getInstance(this).shutDown();
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

    private void initParam() {
        this.currentContext = this;
        this.SbkInstance = ScwService.getInstance();
        this.mCompositeDisposable = new CompositeDisposable();
        this.walletService = new WalletService();

        String ethereumHdPath = ScwService.getHdPath(ScwCoinType.ETH, 0);
        getPublicAddress(ethereumHdPath);
    }

    private void getPublicAddress(String hdPath) {
        KeyStoreManager.getInstance(this).getPublicAddress(hdPath, new ScwService.ScwGetAddressListCallback() {
            @Override
            public void onSuccess(List<String> addressList) {
                publicAddress = addressList.get(0);
                Log.i(Util.LOG_TAG, "Address from SBK is : " + publicAddress);
            }

            @Override
            public void onFailure(int i, @Nullable String s) {
                Log.e(Util.LOG_TAG, "Error Code: " + i + " - msg: " + s);
            }
        });
    }

    public CompositeDisposable getCompositeDisposable() {
        return mCompositeDisposable;
    }

    @Deprecated
    private void getTopPlayersAsync(){
        getCompositeDisposable().add(walletService.getTopPlayers()
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribeWith(new DisposableObserver<List>() {

                    @Override
                    public void onNext(List list) {
                        Log.d(TAG, "getTopPlayers():list: " + list);

                    }

                    @Override
                    public void onError(Throwable e) {
                        Log.d(TAG, "getTopPlayers():e: " + e.getMessage());
                        e.printStackTrace();
                    }

                    @Override
                    public void onComplete() {
                        Log.d(TAG, "getTopPlayers():onComplete()");
                    }
                }));
    }

    public static String getTopPlayers() {
        try {
            Object result = walletService.getTopPlayers(publicAddress);
            Log.d(TAG, "getTopPlayers(): " + result);
            return result.toString();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    public static void updateScore(String level, String sequence){
        checkForUpdateThenSignTransaction(level, sequence);
    }

    private static void checkForUpdateThenSignTransaction(String level, String sequence){
        ScwService.ScwCheckForMandatoryAppUpdateCallback callback =
            new ScwService.ScwCheckForMandatoryAppUpdateCallback() {
                @Override
                public void onMandatoryAppUpdateNeeded(boolean needed) {
                    if(needed){
                        Util.launchDeepLink(currentContext, ScwDeepLink.GALAXY_STORE);
                    } else {
                        signEthTransaction(level, sequence);
                    }
                }
            };

        currentContext.SbkInstance.checkForMandatoryAppUpdate(callback);
    }

    private static void signEthTransaction(String level, String sequence){
        String speed = "average"; // slow | average | fast

        TransactionViewModel.createAndSignTransaction(currentContext, publicAddress, publicAddress, new BigInteger(level), sequence, speed, new ScwService.ScwSignEthTransactionCallback() {
            @Override
            public void onSuccess(byte[] bytes) {
                Log.i(Util.LOG_TAG, "Signing Successful!");
                TransactionViewModel.setSignedTransaction(bytes);
                TransactionViewModel.sendTransaction(currentContext);
            }

            @Override
            public void onFailure(int errorCode, @Nullable String errorMessage) {
                Log.i(Util.LOG_TAG, "FAILED to Sign Transaction, errorCode: " + errorCode + " errorMessage: " + errorMessage);
            }
        });
    }

    // Don't remove, this is an api
    public static void gotoSamsungBlockchainKeystoreMenu(){
        Util.launchDeepLink(currentContext, ScwDeepLink.MAIN);
    }


}
