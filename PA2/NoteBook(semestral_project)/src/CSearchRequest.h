#ifndef NB_CSEARCHREQUEST_H
#define NB_CSEARCHREQUEST_H

#include "CSQLManager.h"

//---------------------------------------------------------------------------------------
/*! \class CSearchRequest
 \brief Сlass CSearchRequest represents current session search and import requests.
 Preparing searching results, keeping results of request, provides filtration.
 */
class CSearchRequest{
public:
                            CSearchRequest( void );
                            ~CSearchRequest( void );
    void                    fillSearchPatterns( string& pattern );
    void                    getSubTextPattern( string& subtext );
    void                    prepareResultList( CSQLManager* manager, int& criterion );
    void                    updateCurSession( vector<CNote*>& update );
    vector<CNote*>&         getResultList( void );
/*! \fn CSearchRequest::setCurNoteToShow( CNote & choise )
 \brief Function set note that will be showed to user by one of derived
 subclass of EditWindow using ncurses library.
 */
    void                    setCurNoteToShow( CNote & choise );
    void                    clearCurSession( void );
/*! \fn CSearchRequest::curSessionStatus( void )const
 \brief Function will drop all settings and set to default. Clear all storages
 of notes and filter criterions.
 */
    bool                    curSessionStatus( void )const;
    void                    deleteNoteInCurSession( const int& index );
/*! \fn CSearchRequest::getListByType( vector<CNote*>& listNotes, const string& type )
 \param[in] listNotes list of searching result filtered by type
 \param[in] type parameter for filtration of result list
 \brief Function filtered actual result list of notes by type requested by user.
 */
    void                    getListByType( vector<CNote*>& listNotes, const string& type );
    CNote*                  getCurNote( void )const;
private:
    set<string>         m_patternToSearch;           // storage for tags or for names
    string              m_subText;
    vector<CNote*>      m_searchResult;              // searching result
    CNote*              m_curRequest;                // current note to print etc...
};
//---------------------------------------------------------------------------------------


#endif /* NB_CSEARCHREQUEST_H */
