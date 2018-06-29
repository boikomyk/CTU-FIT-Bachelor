#ifndef NB_DB_H
#define NB_DB_H

#include <iostream>
#include <sqlite3.h>
#include <set>
#include <string>
#include <cstring>
#include <vector>
#include <algorithm>
#include <ctype.h>
#include <fstream>

using namespace std;

//---------------------------------------------------------------------------------------
/*! \struct Error
 \brief All types of errors
 */
class Error
{
public:
    Error( const string& desc )
    : m_Desc( desc ){}
    string what( void ) const { return m_Desc; }
private:
    string m_Desc;
};
//---------------------------------------------------------------------------------------
/*! \class CDatabase
 \brief Class CDatabase represents sqlite database. Provides creating, database access routine,
 manipulating with data of database, CRUD operations on it. Access to this class have only CSQLManager
 that is manage current session.
 */
class CDatabase{
public:
                    CDatabase( void );
                    ~CDatabase( void );
/*! \fn CDatabase::createDefaultTables( void )const
 \brief Function needs for creating external db if such one doesnt exists and adding three
 default tables(Note and Tags many to many using join table TAG_NOTE ). In case if external
 db and tables are already exist, function doesnt do anything.
 */
    void            createDefaultTables( void );
    int             insertNote( const string& title, const string& type, const string& content, const int& price, set<string>& tags );
/*! \fn CDatabase::getConnection( void )const
 \brief Function needs for CSQManager to copy all data to local storage for actual session
 fast searching, accessing and other CRUD operations. Returns pointer to instance of external
 database connection object.
 */
    sqlite3 *       getConnection( void )const;
    void            delUsingID( const int& indexToDel );

private:
    sqlite3*      db;                           
    char*         zErrMsg;
    int           rc;
    string        sqlstatement;
    sqlite3_stmt* stmt;
};
//---------------------------------------------------------------------------------------

#endif /* NB_DB_H */
