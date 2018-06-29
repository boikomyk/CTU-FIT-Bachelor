#ifndef NB_CNOTETEXT_H
#define NB_CNOTETEXT_H

#include "CNote.h"

//---------------------------------------------------------------------------------------
/*! \class CNoteText
 \brief Derived class CNoteText from base class CNote. Represents a single note of type ordinary text
 in database for current session.
 */
class CNoteText: public CNote
{
public:
                    CNoteText (const string& title, const string& type, const string& content, const string& curForm, const int& price );
    virtual         ~CNoteText();
/*! \fn CNoteText::prepareContent( vector<string>& content )const
 \brief Function prepare ordinary text note content needs for EditWindow all
 derived classes to represent selected note in graphical look using ncurses libraries.
 */
    virtual void    prepareContent( vector<string>& content)const;
/*! \fn CNote::prepareContentHTML( ofstream& htmlFile )const
 \brief Function prepare ordinary text note content (fill content with html tags) needs for CSQLManager
 to export formatted content to newly created html file.
 */
    virtual void    prepareContentHTML( ofstream& htmlFile )const;
private:
};
//---------------------------------------------------------------------------------------


#endif /* NB_CNOTETEXT_H */
