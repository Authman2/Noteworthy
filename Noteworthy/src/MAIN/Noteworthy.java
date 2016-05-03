package MAIN;

import java.awt.BorderLayout;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JSplitPane;

import GUI.GUIWindow;
import GUI.RecentNotesWindow;

/** Copyright (C) 2016  Adeola Uthman

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.*/
public class Noteworthy {

	//@SuppressWarnings("unused")
	public static void main(String[] args) {
		//Load all of the assets
		//Assets assets = new Assets();
		
		//Create the frame
		JFrame frame = new JFrame("Noteworthy");
		frame.setSize(820,530);
		frame.setLocationRelativeTo(null);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		
		//Create a split pane
		JSplitPane splitPane = new JSplitPane();
		frame.getContentPane().add(splitPane, BorderLayout.CENTER);
		
		//The two panels that the split pane will hold
		JPanel gui = new GUIWindow(frame);
		gui.setLayout(null);
		JPanel top = new RecentNotesWindow(gui);

		//Add them as components
		splitPane.setRightComponent(gui);
		splitPane.setLeftComponent(top);
		
		//Set frame to visible
		frame.setVisible(true);
	}

}
