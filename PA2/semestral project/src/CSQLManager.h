#ifndef NB_CSQLMANAGER_H
#define NB_CSQLMANAGER_H

#include <map>

#include "CNoteText.h"
#include "CNoteTaskList.h"
#include "CNoteShopList.h"

//---------------------------------------------------------------------------------------
/*! \class CSQLManager
 \brief Сlass CSQLManager represents set of functions for manipulating notes
 stored in local database copy storage and updating external database. While
 creating instance of CSQLManager class procced copy of all data to local storage during current session. 
 */
class CSQLManager{
public:
                    CSQLManager( CDatabase * db );
                    ~CSQLManager();
    void            addNote( CNote& note, set<string>& tags );
/*! \fn searchInLocalDB( set<string>& patterns,  vector <CNote*>& resultList )const
 \brief Function represent filtration by tags or notes titles. Called by CSearchRequest
 and returns list of notes mathes adjusted filter criterion.
 \param[in] patterns Filter criterion using during filtration
 \param[in] resultList storage for notes to fill during filtration
 */
    void            searchInLocalDB( set<string>& patterns,  vector <CNote*>& resultList )const;
/*! \fn searchInLocalDB( string& subText,  vector <CNote*>& resultList )const
 \brief Function represent filtration by subtext that may appear in notes content. Called by CSearchRequest
 and returns list of notes mathes adjusted filter criterion.
 \param[in] subText Filter criterion using during filtration
 \param[in] resultList storage for notes to fill during filtration
 */
    void            searchInLocalDB( string& subText,  vector <CNote*>& resultList, int& criterion )const;
    void            getAllNotes( vector <CNote*>& resultList ) const;
    void            updateInfoDB( int idNote, set<string>& tagsToAdd, const CNote & updatedNote )const;
    int             getIdNoteDB( const CNote& pattern ) const;
/*! \fn CSQLManager::exportSearchingResult( vector<CNote *>& resultSet, const string& fileName )const
 \brief Function get the result list of searching from CSearchRequest, created
 output CSV file and export list of notes to it.
 */
    void            exportSearchingResultCSV( vector<CNote *>& resultSet, const string& fileName )const;
    void            exportSearchingResultHTML( vector<CNote *>& resultSet, const string& fileName )const;
    void            addingTagsToExistedNote( set<string>& tags, CNote& pattern );
/*! \fn CSQLManager::importNotesToDB( vector <CNote*>&, const string & path )
 \brief Function exports notes to CSV file on path specified by second parametr.
 Function called by EditWindow and all derived subclasses.
 */
    void            importNotesToDB( vector <CNote*>&, const string & path );
    void            delNoteFromDB( const CNote& noteToDel );

private:
/*! \var m_dbMan;
 \brief Represents a connetion to actual opened database.
 */
    CDatabase*                      m_dbMan;
/*! \var m_localStorageDB;
 \brief Represents a local storage of notes, where the key is the set of tags
 of corresponding note in external DB. In this case need to use multimap, because
 two or more note may have the same set of tags.
 */
    multimap<set<string>, CNote*>   m_localStorageDB;        // key: set of tags; value: pointer to CNote*
/*! \var m_idFastSearching;
 \brief Represents a local storage of notes, where the the first value in pair
 is the index of corresponding note in external DB.
 */
    vector<pair<int, CNote*>>       m_idFastSearching;
};
//---------------------------------------------------------------------------------------



#endif /* NB_CSQLMANAGER_H */
