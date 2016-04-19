package MAIN;

import java.awt.BorderLayout;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JSplitPane;

import GUI.GUIWindow;
import GUI.TopicsWindow;


public class Noteworthy {

	public static void main(String[] args) {
		//Create the frame
		JFrame frame = new JFrame("Noteworthy");
		frame.setSize(750,530);
		frame.setLocationRelativeTo(null);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		
		//Create a split pane
		JSplitPane splitPane = new JSplitPane();
		frame.getContentPane().add(splitPane, BorderLayout.CENTER);
		
		//The two panels that the split pane will hold
		JPanel gui = new GUIWindow(frame);
		gui.setLayout(null);
		JPanel top = new TopicsWindow();

		//Add them as components
		splitPane.setRightComponent(gui);
		splitPane.setLeftComponent(top);
		
		//Set frame to visible
		frame.setVisible(true);
	}

}
