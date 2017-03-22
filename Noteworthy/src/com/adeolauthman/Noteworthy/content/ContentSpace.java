package com.adeolauthman.Noteworthy.content;

import javafx.scene.Scene;
import javafx.scene.control.TabPane;

public class ContentSpace {

	/***********************
	 * 					   *
	 *		Variables	   *
	 *					   *
	 ***********************/
	
	TabPane tabPane;
	Scene scene;
	
	
	
	
	/***********************
	 * 					   *
	 *	  Constructors	   *
	 *					   *
	 ***********************/
	
	public ContentSpace() {
		tabPane = new TabPane();
		
		// Add elements
		
		scene = new Scene(tabPane, 500, 500);
	}
	
	
	
	
	/***********************
	 * 					   *
	 *		 Getters	   *
	 *					   *
	 ***********************/
	
	public Scene getScene() { return scene; }
	
	public TabPane getTabPane() { return tabPane; }
	
}
