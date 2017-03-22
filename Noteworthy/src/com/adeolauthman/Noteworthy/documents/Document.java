package com.adeolauthman.Noteworthy.documents;

public class Document {

	/***********************
	 * 					   *
	 *		Variables	   *
	 *					   *
	 ***********************/
	
	String title;
	String content;
	
	
	
	
	/***********************
	 * 					   *
	 *	   Constructors	   *
	 *					   *
	 ***********************/
	
	public Document(String title, String content) {
		this.title = title;
		this.content = content;
	}
	
	
	
	/***********************
	 * 					   *
	 *		 Setters	   *
	 *					   *
	 ***********************/
	
	public void setTitle(String t) { this.title = t; }
	
	public void setContent(String cont) { this.content = cont; }
	
	
	
	/***********************
	 * 					   *
	 *		 Getters	   *
	 *					   *
	 ***********************/
}
