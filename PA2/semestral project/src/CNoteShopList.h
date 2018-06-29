#ifndef NB_CNOTESHOPLIST_H
#define NB_CNOTESHOPLIST_H

#include "CNote.h"

//---------------------------------------------------------------------------------------
/*! \class CNoteShopList
 \brief Derived class CNoteShopList from base class CNote. Represents a single note of type shop list
 in database for current session.
 */
class CNoteShopList: public CNote
{
public:
                    CNoteShopList( const string& title, const string& type, const string& content, const string& curForm, const int& price );
    virtual         ~CNoteShopList();
/*! \fn CNoteShopList::prepareContent( vector<string>& content )const
 \brief Function prepare shop list note content needs for EditWindow all
 derived classes to represent selected note in graphical look using ncurses libraries.
 */
    virtual void    prepareContent( vector<string> & content )const;
/*! \fn CNoteShopList::prepareContentHTML( ofstream& htmlFile )const
 \brief Function prepare shop list note content (fill content with html tags) needs for CSQLManager
 to export formatted content to newly created html file.
 */
    virtual void    prepareContentHTML( ofstream& htmlFile )const;
private:
};
//---------------------------------------------------------------------------------------

#endif /* NB_CNOTESHOPLIST_H */
