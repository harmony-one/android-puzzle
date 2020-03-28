package org.cocos2dx.javascript.service;

import android.util.Log;

import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public final class LeaderBoard {
    private List<Entry> _list;

    Gson gson = new Gson();

    public void init() {
        _list = new ArrayList<>();

        _list.add(new Entry("0xe7125ee1bc64ab7c51ce3617cb83e76fd545f1a9", 80));
        _list.add(new Entry("0xf8425ee1bc64ab7c51ce3617cb83e76fd545f1b0", 78));
        _list.add(new Entry("0xa9325ee1bc64ab7c51ce3617cb83e76fd545f1c1", 75));
        _list.add(new Entry("0xd6625ee1bc64ab7c51ce3617cb83e76fd545f1d2", 70));
        _list.add(new Entry("0x95e25ee1bc64ab7c51ce3617cb83e76fd545f1e3", 90));
        _list.add(new Entry("0xb4325ee1bc64ab7c51ce3617cb83e76fd545f1f4", 55));
        _list.add(new Entry("0xc2325ee1bc64ab7c51ce3617cb83e76fd545f1a5", 44));
        _list.add(new Entry("0xe5425ee1bc64ab7c51ce3617cb83e76fd545f1b6", 33));
        _list.add(new Entry("0xf1225ee1bc64ab7c51ce3617cb83e76fd545f1c7", 200));
        _list.add(new Entry("0x35d25ee1bc64ab7c51ce3617cb83e76fd545f1d8", 20));
        _list.add(new Entry("0x46a25ee1bc64ab7c51ce3617cb83e76fd545f1e9", 150));

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
        Entry found = null;
        for (Entry entry: _list) {
            if(entry.key == keystore) {
                found = entry;
                break;
            }
        }

        if (found != null) {
            if (score > found.score) {
                found.score = score;
            }
        }
        else {
            Entry newEntry = new Entry(keystore, score);
            _list.add(newEntry);
        }
        Collections.sort(_list);
    }
}