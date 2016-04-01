package MAIN;

import java.awt.Image;
import java.awt.Toolkit;

import javax.swing.ImageIcon;
import javax.swing.JFrame;

import GUI.GUIWindow;


public class Noteworthy {

	public static void main(String[] args) {
		GUIWindow window = new GUIWindow("Noteworthy");
		window.setSize(640, 580);
		window.setLocationRelativeTo(null);
		window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		
		Image icon = Toolkit.getDefaultToolkit().getImage("/IMAGES/NoteworthyIcon.png");
		window.setIconImage(new ImageIcon(Noteworthy.class.getResource("/IMAGES/NoteworthyIcon.png")).getImage());
		
		window.setVisible(true);
	}

}
