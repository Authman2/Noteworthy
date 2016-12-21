package main;

import cw.components.titlebar.generic.TitlebarOrientation;
import cw.components.windows.generic.CustomWindow;
import gui.MainWindow;

public class Noteworthy {

	public static void main(String[] args) {
		CustomWindow window = new MainWindow("Noteworthy", TitlebarOrientation.RIGHT);
		window.setSize(550,450);
		window.setLocationRelativeTo(null);
		window.setResizable(false);
		
		window.setVisible(true);
	}

}
