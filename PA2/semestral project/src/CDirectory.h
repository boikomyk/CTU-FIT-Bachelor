#ifndef NB_CDIRECTORY_H
#define NB_CDIRECTORY_H

#include "CSearchRequest.h"

#include <dirent.h>
#include <sys/stat.h>
#include <sstream>

//---------------------------------------------------------------------------------------
/*! \class CDirectory
 \brief Class CDirectory represents a directory. Provides some CRUD operations.
 Let user to manipulate with files on choosen directory.
 */
class CDirectory{
public:
                         CDirectory( const string&, const string& );
                         ~CDirectory( void );
    void                 readDirectory( void );
    vector<string> &     getFileList( void );
    string               getRelativePath( void ) const;
/*! \fn CDirectory::checkFormatImport( const int index )const
 \param[in] index of actual file in directory
 \brief Function will control if file located in directory by index satisfy format condition,
 concretely CSV extension.
 */
    bool                 checkFormatImport( const int index )const;
/*! \fn CDirectory::checkFormatShow( const int index )const
 \param[in] index of actual file in directory
 \brief Function will control if file located in directory by index have CSV extension. If condition satisfy,
 function will return true and by that all CSV content will be imported to external DB.
 */
    bool                 checkFormatShow( const int index )const;
/*! \fn CDirectory::fileFormat(const int index)const
 \param[in] index of actual file in directory
 \brief Function will control if file located in directory by index have CSV or HTML extension.
 If condition satisfy, function will return true and by that content of file will be displayed
 to user using ncurses library in case CSV or any default_browser setted in system. .
 */
    string               fileFormat(const int index)const;
/*! \fn CDirectory::getCSVContentShow( const int )
 \param[in] index of actual file in directory
 \brief Function returned string filled with content of CSV file. This function is defined
 for fast look at content of CSV file, based on that content user can decide import it or not.
 */
    string               getCSVContentShow( const int index );
    string               returnPathToFile( const int ) const;
    void                 delCSV( const string & );
/*! \fn CDirectory::showHTML( const int index )const
 \param[in] index of actual file in directory
 \brief Function will execute shell command based on system that will displayed
 html file to user in default_browser.
 */
    void                 showHTML( const int index )const;
private:
    string          m_name;
    string          m_path;
    vector<string>  m_FileList;
};
//---------------------------------------------------------------------------------------

#endif /* NB_CDIRECTORY_H */
