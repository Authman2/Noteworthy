package MAIN;

import java.awt.image.BufferedImage;

import visualje.JEImage;


/**Copyright (C) 2016  Adeola Uthman

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.*/
public class Assets {
	
	public static JEImage icons = new JEImage();
	
	
	public static BufferedImage NEW_NOTE, SAVE_NOTE, OPEN_NOTE, SAVE_AS, BOLD,
								ITALIC, UNDERLINE, STRIKETHROUGH, FONTS, FINDREPLACE,
								COLOR, BULLETED_LIST, NUMBERED_LIST, UNDO, REDO;
	

	public Assets() {
		icons = new JEImage(Noteworthy.class, "/IMAGES/Icons.png");
		
		
		NEW_NOTE = icons.getPart(0, 0, 35, 35);
		SAVE_NOTE = icons.getPart(35, 0, 35, 35);
		OPEN_NOTE = icons.getPart(70, 0, 35, 35);
		SAVE_AS = icons.getPart(105, 0, 35, 35);
		BOLD = icons.getPart(140, 0, 35, 35);
		ITALIC = icons.getPart(175, 0, 35, 35);
		UNDERLINE = icons.getPart(210, 0, 35, 35);
		STRIKETHROUGH = icons.getPart(245, 0, 35, 35);
		FONTS = icons.getPart(280, 0, 35, 35);
		FINDREPLACE = icons.getPart(315, 0, 35, 35);
		COLOR = icons.getPart(0, 35, 35, 35);
		BULLETED_LIST = icons.getPart(35, 35, 35, 35);
		NUMBERED_LIST = icons.getPart(70, 35, 35, 35);
		UNDO = icons.getPart(105, 35, 35, 35);
		REDO = icons.getPart(140, 35, 35, 35);
	}
	
	
	

}
