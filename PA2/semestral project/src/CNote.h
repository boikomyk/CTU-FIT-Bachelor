#ifndef NB_CNOTE_H
#define NB_CNOTE_H

#include "DB.h"

//---------------------------------------------------------------------------------------
/*! \class CNote
 \brief Abstract class CNote represents a single note in database for current session.
 Allow to provide CRUD operations on it: read, create, update, delete.
 Mainly all notes are stored in instance of class CSQLManager and some part in CSearchRequest.
 */
class CNote
{
public:
                        CNote( const string& title, const string& type, const string& content, const string& curForm, const int& price );
    virtual             ~CNote();
    virtual string      getTitle() const;
    virtual string      getType() const;
    virtual string      getContent() const;
    virtual int         getPrice() const;
/*! \fn CNote::prepareContent( vector<string>& content )const = 0
 \brief Function depending on derived class prepare note content needs for EditWindow all
 derived classes to represent selected note in graphical look using ncurses libraries.
 */
    virtual void        prepareContent( vector<string>& content)const = 0;
    virtual void        updateInfo( const string& title, const string& content, const string& curForm, const int& price );
/*! \fn CNote::prepareContentHTML( ofstream& htmlFile )const = 0
 \brief Function depending on derived class prepare note content (fill content with special html tags) needs for CSQLManager
 to export formatted content to newly created html file.
 */
    virtual void        prepareContentHTML( ofstream& htmlFile )const = 0;
    static  void        eraseTrailingSpaces(string & toEdit);
protected:
    string   m_title;
    string   m_type;
    string   m_content;
    string   m_curForm;
    int      m_price;
};
//---------------------------------------------------------------------------------------


#endif /* NB_CNOTE_H */
