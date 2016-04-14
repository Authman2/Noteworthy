package EXTRA;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.Dictionary;
import java.util.Enumeration;

public class MakeDictionary extends Dictionary<Integer,String> {
	
	int key = 0;
	
	public MakeDictionary() {
		try {
		    URL myURL = new URL("http://www.dictionary.com/");
		    URLConnection myURLConnection = myURL.openConnection();
		    myURLConnection.connect();
		    
		    InputStream is = myURLConnection.getInputStream();
		    BufferedReader br = new BufferedReader(new InputStreamReader(is));
		    
		    String word = "";
		    
		    while((word = br.readLine()) != null) {
		    	put(key, word);
		    	System.out.println(word);
		    	key++;
		    }
		    
		    
		} catch (MalformedURLException e) { 
		   e.printStackTrace();
		   
		} catch (IOException e) {   
			e.printStackTrace();
		}
	}

	@Override
	public int size() {
		return size();
	}

	@Override
	public boolean isEmpty() {
		return isEmpty();
	}

	@Override
	public Enumeration<String> elements() {
		return null;
	}

	@Override
	public String get(Object key) {
		return get(key);
	}


	@Override
	public String remove(Object key) {
		return remove(key);
	}

	@Override
	public String put(Integer key, String value) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Enumeration<Integer> keys() {
		// TODO Auto-generated method stub
		return null;
	}

}
