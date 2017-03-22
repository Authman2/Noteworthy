package com.adeolauthman.Noteworthy.controllers;

import com.adeolauthman.Noteworthy.content.ContentSpace;

import javafx.stage.Stage;

public class Controller {
	
	/***********************
	 * 					   *
	 *		Variables	   *
	 *					   *
	 ***********************/
	
	ContentSpace contentSpace;
	
	
	
	
	
	/***********************
	 * 					   *
	 *	  Constructors	   *
	 *					   *
	 ***********************/
	
	public Controller(Stage stage) {
		contentSpace = new ContentSpace();
		
		
		stage.setScene(contentSpace.getScene());
	}
	
	
	
	/***********************
	 * 					   *
	 *		 Setters	   *
	 *					   *
	 ***********************/
	
	public void initialize() {
		
	}
	
}
