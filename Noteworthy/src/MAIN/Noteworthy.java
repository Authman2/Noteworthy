package MAIN;

import javax.swing.JFrame;

import GUI.GUIWindow;


public class Noteworthy {

	public static void main(String[] args) {
		GUIWindow window = new GUIWindow("Noteworthy");
		window.setSize(640, 580);
		window.setLocationRelativeTo(null);
		window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		
		window.setVisible(true);
	}

}
