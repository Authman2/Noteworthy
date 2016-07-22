package GUI;

import java.awt.BorderLayout;
import java.awt.GridLayout;

import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;

/**Copyright (C) 2016  Adeola Uthman

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.*/
public class AboutWindow extends JFrame {
	private static final long serialVersionUID = 3078023730240644548L;

	JLabel infoLabel = new JLabel();
	
	public AboutWindow(String title) {
		super(title);
		setSize(500,300);
		setLocationRelativeTo(null);
		
		infoLabel.setBounds(10, 10, 480, 280);
		infoLabel.setText("<html> Welcome to Noteworthy, an easy to use note taking application. Noteworthy is for everyone, from"
				+ "  elementary school aged children to adults in the workforce. Noteworthy can be used for anything from small,"
				+ "  quick notes to large, fully developed essays."
				+ "<br><br> Created by: Adeola Uthman"
				+ "<br> Version: 1.0"
				+ "<br> Copyright (c) Adeola Uthman 2016</html>");
		
		JPanel center = new JPanel(new GridLayout(1,1,10,10));
			center.add(infoLabel);
			
		getContentPane().add(center, BorderLayout.CENTER);
	}

}
