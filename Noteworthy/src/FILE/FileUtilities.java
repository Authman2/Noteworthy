package FILE;

import java.io.File;

/** This class is responsible for defining which file formats are accepted when loading notes. The method getExtension
 * just returns the extension of the specified file so it can check elsewhere if it is valid. 
 * Copyright (C) 2016  Adeola Uthman

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.*/
public abstract class FileUtilities {

	public static final String txt = "txt";
	public static final String noteworthyfile = "ntwy";
	
	
	public static String getExtension(File f) {
		String ext = "";
		int i = f.getName().indexOf(".");
		
		if(i > 0 && i < f.getName().length() - 1) {
			ext = f.getName().substring(i+1).toLowerCase();
		}
		
		return ext;
	}
}
