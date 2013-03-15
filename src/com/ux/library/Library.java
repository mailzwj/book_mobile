package com.ux.library;

import org.apache.cordova.DroidGap;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;

public class Library extends DroidGap {

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		//setContentView(R.layout.library);
		super.loadUrl("file:///android_asset/index.html");
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.library, menu);
		return true;
	}
	
	@Override
	public boolean onOptionsItemSelected(MenuItem item){

		//Log.v("item", Integer.toString(item.getItemId()));
		switch(item.getItemId()){
			case R.id.closeapp: {
				finish();
				break;
			}
			case R.id.restart: {
				Intent i = getBaseContext().getPackageManager().getLaunchIntentForPackage(getBaseContext().getPackageName());
				i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
				startActivity(i);
				break;
			}
		}
		return false;
	}
}
