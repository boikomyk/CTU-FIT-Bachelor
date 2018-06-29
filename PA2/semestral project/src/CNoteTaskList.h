#ifndef NB_CNOTETASKLIST_H
#define NB_CNOTETASKLIST_H

#include "CNote.h"

//---------------------------------------------------------------------------------------
/*! \class CNoteTaskList
 \brief Derived class CNoteTaskList from base class CNote. Represents a single note of type task list
 in database for current session.
 */
class CNoteTaskList: public CNote
{
public:
                    CNoteTaskList( const string& title, const string& type, const string& content, const string& curForm, const int& price );
    virtual         ~CNoteTaskList();
/*! \fn CNoteTaskList::prepareContent( vector<string>& content )const
 \brief Function prepare task list note content needs for EditWindow all
 derived classes to represent selected note in graphical look using ncurses libraries.
 */
    virtual void    prepareContent( vector<string> & content )const;
/*! \fn CNoteTaskList::prepareContentHTML( ofstream& htmlFile )const
 \brief Function prepare task list note content (fill content with html tags) needs for CSQLManager
 to export formatted content to newly created html file.
 */
    virtual void    prepareContentHTML( ofstream& htmlFile )const;
private:
};
//---------------------------------------------------------------------------------------

#endif /* NB_CNOTETASKLIST_H */
