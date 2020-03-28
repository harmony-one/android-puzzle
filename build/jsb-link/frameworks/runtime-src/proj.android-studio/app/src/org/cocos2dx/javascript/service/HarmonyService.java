package org.cocos2dx.javascript.service;

import android.util.Log;

import java.io.IOException;
import java.util.List;

import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.GET;
import retrofit2.http.Path;

public final class HarmonyService implements IHarmonyService {
    public static final String API_URL = "https://api.github.com";

    @Override
    public Call<List<Repo>> listRepos(String user) {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(API_URL)
                .build();

        IHarmonyService service = retrofit.create(IHarmonyService.class);

        Call<List<Repo>> repos = service.listRepos("tungth214");

        return repos;
    }

    @Override
    public Call<List<Contributor>> contributors(String owner, String repo) {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(API_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        IHarmonyService service = retrofit.create(IHarmonyService.class);

        Call<List<Contributor>> callContributors = service.contributors("square", "retrofit");

        // USING
        // Fetch and print a list of the contributors to the library.
        List<Contributor> list = null;
        try {
            list = callContributors.execute().body();
        } catch (IOException e) {
            Log.e("puzzle", e.getMessage());
        }

        for (Contributor contributor : list) {
            Log.i("puzzle", contributor.login + " (" + contributor.contributions + ")");
        }

        return callContributors;
    }
}

interface IHarmonyService {
    @GET("users/{user}/repos")
    Call<List<Repo>> listRepos(@Path("user") String user);

    @GET("/repos/{owner}/{repo}/contributors")
    Call<List<Contributor>> contributors(
            @Path("owner") String owner,
            @Path("repo") String repo);
}

class Repo{

}

class Contributor {
    public final String login;
    public final int contributions;

    public Contributor(String login, int contributions) {
        this.login = login;
        this.contributions = contributions;
    }
}