package FILE;

import java.io.File;

import javax.swing.filechooser.FileFilter;

/** This class extends FileFilter, and makes sure to display the appropriate text and actions for when certain files are being
 * selected. 
 * Copyright (C) 2016  Adeola Uthman

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.*/
public class ExtensionFilter extends FileFilter {

	private String extension = "";
	
	public ExtensionFilter(String extension) {
		this.extension = extension;
	}

	@Override
	public boolean accept(File f) {
		if(f.isFile()) {
			String ext = FileUtilities.getExtension(f);
			if(ext != null) {
				if((ext.equals(FileUtilities.txt) && extension.equals("txt")) ||
						(ext.equals(FileUtilities.noteworthyfile) && extension.equals("ntwy"))	) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		}		
		
		return false;
	}

	@Override
	public String getDescription() {
		if(this.extension.equals("txt")) {
			return "txt -- A plain text file.";
		} else if(this.extension.equals("ntwy")){
			return "ntwy -- A Noteworthy text file.";
		}
		
		return "";
	}

}
