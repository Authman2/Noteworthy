package com.adeolauthman.Noteworthy.main;

import com.adeolauthman.Noteworthy.controllers.Controller;

import javafx.application.Application;
import javafx.stage.Stage;

public class Noteworthy extends Application {

	
	
	public static void main(String[] args) {
		launch(args);
	}
	
	
	
	
	
	@Override
	public void start(Stage primaryStage) throws Exception {
		primaryStage.setTitle("Noteworthy");
		
		Controller controller = new Controller(primaryStage);
		controller.initialize();
		
		primaryStage.show();
	}

}
