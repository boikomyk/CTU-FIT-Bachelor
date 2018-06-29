#ifndef __PROGTEST__
#include <cassert>
#include <cstdio>
#include <cstdlib>
#include <climits>
#include <iostream>
#include <sstream>
#include <iomanip>
#include <string>
#include <vector>
#include <queue>
#include <stack>
#include <deque>
#include <map>
#include <set>
#include <list>
#include <algorithm>
#include <functional>
#include <iterator>
#include <memory>
#include <stdexcept>


using namespace std;
#endif /* __PROGTEST__ */

// enable only if your implementation supports Add ( ) with more than three parameters
#define MULTIPLE_STOPS

//====================================================================_____Node_____================================================================================
/**
  * Declaration of template class Node
  * In class are stored pointers to all neighbors and links concatenating them with actual node
  */
template <typename _T, typename _E>
class Node{
public:
    Node(const _T * name): m_listOfNeighbors(), m_cntDist(new int(0)), m_pName(name){}
    ~Node(){
        delete m_cntDist;
    }
    // overloading operator for comparing instance of class
    bool operator<(const Node& other) const{
        return (*m_pName < *(other->m_pName));
    }
    
    // Setter method
    void setCntDist(int value){
        *m_cntDist = value;
    }
    
    // Getter methods
    const _T * getName() const{
        return m_pName;
    }
    
    int getCntDist() const{
        return *m_cntDist;
    }
    
    map<Node<_T,_E>*, list<const _E*>> & getListOfNeighbors(){
        return m_listOfNeighbors;
    }
private:
    map<Node<_T,_E>*, list<const _E*>>        m_listOfNeighbors;       /**< map, where key is pointer to neighbor and value is a list of links  */
    int  *                                    m_cntDist;               /**< count distance needed for BFS algorithm                             */
    const _T *                                m_pName;                 /**< pointer to name of node stored in class CAccess                     */
};
//==================================================================================================================================================================
/** Template structure comp
  * Operator bool is implicit function for Find() method in class CAccess. Used if parametr filter wont be added
  * @param obj Obj is template parametr used in filter
  * @return Always return true
  */
template <typename _E>
struct comp{
bool operator()(const _E& obj) const
    {
        return true;
    }
};
//===================================================================_____CAccess_____==============================================================================
template <typename _T, typename _E>
class CAccess
{
public:
    CAccess(): m_listOfNodes(){}
    ~CAccess(){
        for(auto & i : m_listOfNodes)
            delete i.second;
        for(auto & i : m_links)
            delete i;
    }
    
    // Methods:
    template <typename... Args>
    CAccess & Add(const _E& , Args&& ...);
    
    // Help method for adding new link to neighbor of actual node, used by calling in Add() method
    void InsertData(typename map<_T ,Node<_T, _E>*>::iterator, typename map<Node<_T,_E>*, list<const _E*>>::iterator,  _E *, Node<_T,_E>*);
    
    template<typename _M = bool, typename _F = comp<_E>>
    map<_T,int> Find(const _T&, const _M& = false, const _F& = comp<_E>()) const;
    
    template<typename _F>
    void bfsGraph(map<_T,int>&, const _T&, int, const _F&) const;
private:
    map<_T ,Node<_T, _E>*>     m_listOfNodes;              /**< map of all nodes. Key is the name of node, value is a pointer to Node where stored all info */
    list<_E*>                  m_links;                    /**< Storage for all links                                                                       */
};
//==================================================================================================================================================================
/** Template method for inserting new neighbor node or just adding new link to already exists neighbor
  * @param  itNode Iterator pointing to node in m_listOfNodes. Access to info about this node and its neighbors
  * @param  link Link is a template parametr that defined link concatenate actual node and pNode.
  * @param  pNode Node that is neighbor of actual node
  */
template <typename _T, typename _E>
void CAccess<_T, _E>::InsertData(typename map<_T ,Node<_T, _E>*>::iterator itNode, typename map<Node<_T,_E>*, list<const _E*>>::iterator itPush,  _E * link,  Node<_T,_E>* pNode){
    // Such neighbor doesnt exist, create
    if(itPush == itNode->second->getListOfNeighbors().end()){
        list <const _E*> tmpListOfLinks;
        tmpListOfLinks.push_back(link);
        itNode->second->getListOfNeighbors().insert({pNode, tmpListOfLinks});
    }
    else{
        // Save new link that concatenate this two nodes
        itPush->second.push_back(link);
    }
}
//==================================================================================================================================================================
/** Variadic template method for adding new nodes and links that concatenate them
  * @param  eLink Link is template parametr that belongs to all following nodes, that concatenate them.
  * @param  args Args is a pack template parametr that accepts zero or more template arguments.
  * @return returns a reference to the actual object
  */
template <typename _T, typename _E>
template <typename... Args>
CAccess<_T, _E> & CAccess<_T, _E>::Add(const _E& eLink, Args&&... args){
    
    // Control count of argumnts
    if(sizeof...(args) == 1)
        return *this;
   
    // Make copy of link
    _E * link = new _E(eLink);
    
    // Save variadic paramert to list:
    initializer_list<_T> listOfInputNodes = {args...};
    
    // Fill m_listOfNodes with new nodes
    for (auto & x : listOfInputNodes){
         auto itPrimaryNode = m_listOfNodes.insert({x, nullptr});

        // such node is not exist, create
        if(itPrimaryNode.second == true)
             itPrimaryNode.first->second = new Node<_T, _E>(&itPrimaryNode.first->first);
        
        if(&x != prev(listOfInputNodes.end())){
            for(auto y = next(&x); y != listOfInputNodes.end(); y++){
                auto itSecondaryNode = m_listOfNodes.insert({*y, nullptr});

                // such node is not exist, create
                if(itSecondaryNode.second == true)
                    itSecondaryNode.first->second = new Node<_T, _E>(&itSecondaryNode.first->first);

                // Check if such neighbor node is already pushed to list of neighbors of primary node and adding concatenating link
                auto itPushFirst = itPrimaryNode.first->second->getListOfNeighbors().find(itSecondaryNode.first->second);
                InsertData(itPrimaryNode.first, itPushFirst, link, itSecondaryNode.first->second);
                
                // Check if such neighbor node is already pushed to list of neighbors of secondary node and adding concatenating link
                auto itPushSecond = itSecondaryNode.first->second->getListOfNeighbors().find(itPrimaryNode.first->second);
                InsertData(itSecondaryNode.first, itPushSecond, link, itPrimaryNode.first->second);
            }
        }
    }
    //Push link to common storage of links
    m_links.push_back(link);
    return *this;
}
//==================================================================================================================================================================
/** Template method of bfs algorithm
  * @param  listOfNeighbors reference to map that will be contain all nodes to them we can get from start node
  * @param  searchPattern  Template parametr that defined name of start node
  * @param  maxDist Limit of length fro bfs running graph
  * @param  functor Give criterions for looking neighbor`s nodes.
  */
template <typename _T, typename _E>
template <typename _F>
void CAccess<_T, _E>::bfsGraph( map <_T,int>& listOfNeighbors, const _T& searchPattern, int maxDist, const _F&  functor) const{
   
    // create a queue of nodes to visit;
    queue<Node<_T, _E>*> queueOfVisited;
    
    // storage for pointers to all proceed nodes
    set<const _T*> proceedNodes;

    // temporary pointer to node poped from queue
    Node<_T, _E> * temp = nullptr;
    auto itStartNode = m_listOfNodes.find(searchPattern);
    
    // Such node doenst exist, throw exception
    if(itStartNode == m_listOfNodes.end()){
        ostringstream buff;
        buff << "unknown " << searchPattern;
        throw invalid_argument(buff.str());
    }
    queueOfVisited.push(itStartNode->second);
    proceedNodes.insert(&itStartNode->first);
    itStartNode->second->setCntDist(0);
    listOfNeighbors.insert({*itStartNode->second->getName(), 0});

    // run till queue of nodes is not empty
    while (!queueOfVisited.empty())
    {
        //pop front node from queue
        temp = queueOfVisited.front();
        queueOfVisited.pop();
        if(temp->getCntDist() >= maxDist)
            return;
        
        for(auto & i : temp->getListOfNeighbors()){
            auto itIfVisited = proceedNodes.find(i.first->getName());
            if(itIfVisited != proceedNodes.end())
                continue;

            // check all links of this node, if some will satisfy functor
            for(const auto & j: i.second){
                if(functor(*j))
                {
                    proceedNodes.insert(i.first->getName());
                    i.first->setCntDist(temp->getCntDist() + 1);
                    queueOfVisited.push(i.first);
                    listOfNeighbors.insert({*i.first->getName(), i.first->getCntDist()});
                    break;
                }
            }
        }
    }
}
//==================================================================================================================================================================
/** Template method for finding all nodes to them we can get from start node
  * @param  node Template parametr that defined start node for BFS algrorithm
  * @param  max  Template parametr that give us limit of distance length.
  * @return function Give criterions for looking neighbor`s nodes.
  */
template <typename _T, typename _E>
template <typename _M, typename _F>
map<_T,int>  CAccess<_T, _E>::Find(const _T& node, const _M& max , const _F& function) const{
    map <_T,int> resultList;
    
    // if second parametr wasnt setted, maxDist set to number of all nodes
    int maxDist = (int)m_listOfNodes.size() - 1;;
    
    if (typeid(max).name() != typeid(bool).name())
        maxDist = max;

    // Run bfs algrotihm
    bfsGraph(resultList, node, maxDist, function);
    return resultList;
}
//==================================================================================================================================================================
#ifndef __PROGTEST__
//=================================================================================================
class CTrain
{
public:
    CTrain                        ( const string    & company,
                                   int               speed )
    : m_Company ( company ),
    m_Speed ( speed )
    {
    }
    //---------------------------------------------------------------------------------------------
    string                   m_Company;
    int                      m_Speed;
};
//=================================================================================================
class TrainFilterCompany
{
public:
    TrainFilterCompany            ( const set<string> & companies )
    : m_Companies ( companies )
    {
    }
    //---------------------------------------------------------------------------------------------
    bool                     operator ()                   ( const CTrain & train ) const
    {
        return m_Companies . find ( train . m_Company ) != m_Companies . end ();
    }
    //---------------------------------------------------------------------------------------------
private:
    set <string>             m_Companies;
};
//=================================================================================================
class TrainFilterSpeed
{
public:
    TrainFilterSpeed              ( int               min,
                                   int               max )
    : m_Min ( min ),
    m_Max ( max )
    {
    }
    //---------------------------------------------------------------------------------------------
    bool                     operator ()                   ( const CTrain    & train ) const
    {
        return train . m_Speed >= m_Min && train . m_Speed <= m_Max;
    }
    //---------------------------------------------------------------------------------------------
private:
    int                      m_Min;
    int                      m_Max;
};
//=================================================================================================
bool                         NurSchnellzug                 ( const CTrain    & zug )
{
    return ( zug . m_Company == "OBB" || zug . m_Company == "DB" ) && zug . m_Speed > 100;
}
//=================================================================================================
int                          main                          ( void )
{
    CAccess<string,CTrain> lines;
    lines . Add ( CTrain (   "DB", 120 ), "Berlin", "Prague"   )
    . Add ( CTrain (   "CD",  80 ), "Berlin", "Prague"   )
    . Add ( CTrain (   "DB", 160 ), "Berlin", "Dresden"  )
    . Add ( CTrain (   "DB", 160 ), "Dresden", "Munchen" )
    . Add ( CTrain (   "CD",  90 ), "Munchen", "Prague"  )
    . Add ( CTrain (   "DB", 200 ), "Munchen", "Linz"    )
    . Add ( CTrain (  "OBB",  90 ), "Munchen", "Linz"    )
    . Add ( CTrain (   "CD",  50 ), "Linz", "Prague"     )
    . Add ( CTrain (   "CD", 100 ), "Prague", "Wien"     )
    . Add ( CTrain (  "OBB", 160 ), "Linz", "Wien"       )
    . Add ( CTrain ( "SNCF", 300 ), "Paris", "Marseille" )
    . Add ( CTrain ( "SNCF", 250 ), "Paris", "Dresden"   )
    . Add ( CTrain ( "SNCF", 200 ), "London", "Calais"   );

    assert ( lines . Find ( "Berlin") == (map<string,int>
      {
        make_pair ( "Berlin", 0 ),
        make_pair ( "Dresden", 1 ),
        make_pair ( "Linz", 2 ),
        make_pair ( "Marseille", 3 ),
        make_pair ( "Munchen", 2 ),
        make_pair ( "Paris", 2 ),
        make_pair ( "Prague", 1 ),
        make_pair ( "Wien", 2 )
      }) );
      assert ( lines . Find ( "London" ) == (map<string,int>
      {
        make_pair ( "Calais", 1 ),
        make_pair ( "London", 0 )
      }) );
      assert ( lines . Find ( "Wien" ) == (map<string,int>
      {
        make_pair ( "Berlin", 2 ),
        make_pair ( "Dresden", 3 ),
        make_pair ( "Linz", 1 ),
        make_pair ( "Marseille", 5 ),
        make_pair ( "Munchen", 2 ),
        make_pair ( "Paris", 4 ),
        make_pair ( "Prague", 1 ),
        make_pair ( "Wien", 0 )
      }) );
      assert ( lines . Find ( "Wien", 3 ) == (map<string,int>
      {
        make_pair ( "Berlin", 2 ),
        make_pair ( "Dresden", 3 ),
        make_pair ( "Linz", 1 ),
        make_pair ( "Munchen", 2 ),
        make_pair ( "Prague", 1 ),
        make_pair ( "Wien", 0 )
      }) );


      assert ( lines . Find ( "Wien", 5, NurSchnellzug ) == (map<string,int>
      {
        make_pair ( "Berlin", 4 ),
        make_pair ( "Dresden", 3 ),
        make_pair ( "Linz", 1 ),
        make_pair ( "Munchen", 2 ),
        make_pair ( "Prague", 5 ),
        make_pair ( "Wien", 0 )
      }) );
    assert ( lines . Find ( "Prague", 3,  TrainFilterCompany ( { "CD", "DB" } ) ) == (map<string,int>
                                                                                      {
                                                                                          make_pair ( "Berlin", 1 ),
                                                                                          make_pair ( "Dresden", 2 ),
                                                                                          make_pair ( "Linz", 1 ),
                                                                                          make_pair ( "Munchen", 1 ),
                                                                                          make_pair ( "Prague", 0 ),
                                                                                          make_pair ( "Wien", 1 )
                                                                                      }) );

      assert ( lines . Find ( "Munchen", 4, TrainFilterSpeed ( 160, 250 ) ) == (map<string,int>
      {
        make_pair ( "Berlin", 2 ),
        make_pair ( "Dresden", 1 ),
        make_pair ( "Linz", 1 ),
        make_pair ( "Munchen", 0 ),
        make_pair ( "Paris", 2 ),
        make_pair ( "Wien", 2 )
      }) );
      assert ( lines . Find ( "Munchen", 4, [] ( const CTrain & x ) { return x . m_Company == "CD"; } ) == (map<string,int>
      {
        make_pair ( "Berlin", 2 ),
        make_pair ( "Linz", 2 ),
        make_pair ( "Munchen", 0 ),
        make_pair ( "Prague", 1 ),
        make_pair ( "Wien", 2 )
      }) );
      assert ( lines . Find ( "London", 20, [] ( const CTrain & x ) { return x . m_Company == "CD"; } ) == (map<string,int>
      {
        make_pair ( "London", 0 )
      }) );
      try
      {
         auto res = lines . Find ( "Salzburg" );
         assert ( "No exception thrown" == NULL );
      }
      catch ( const invalid_argument & e )
      {
        assert ( string ( e . what () ) == "unknown Salzburg" );
      }
    #ifdef MULTIPLE_STOPS
      lines . Add ( CTrain ( "RZD",  80 ), "Prague", "Kiev", "Moscow", "Omsk", "Irkutsk", "Vladivostok" );
      lines . Add ( CTrain ( "LAV", 160 ), "Malaga", "Cordoba", "Toledo", "Madrid", "Zaragoza", "Tarragona", "Barcelona", "Montpellier", "Marseille" );
      assert ( lines . Find ( "Madrid" ) == (map<string,int>
      {
        make_pair ( "Barcelona", 1 ),
        make_pair ( "Berlin", 4 ),
        make_pair ( "Cordoba", 1 ),
        make_pair ( "Dresden", 3 ),
        make_pair ( "Irkutsk", 6 ),
        make_pair ( "Kiev", 6 ),
        make_pair ( "Linz", 5 ),
        make_pair ( "Madrid", 0 ),
        make_pair ( "Malaga", 1 ),
        make_pair ( "Marseille", 1 ),
        make_pair ( "Montpellier", 1 ),
        make_pair ( "Moscow", 6 ),
        make_pair ( "Munchen", 4 ),
        make_pair ( "Omsk", 6 ),
        make_pair ( "Paris", 2 ),
        make_pair ( "Prague", 5 ),
        make_pair ( "Tarragona", 1 ),
        make_pair ( "Toledo", 1 ),
        make_pair ( "Vladivostok", 6 ),
        make_pair ( "Wien", 6 ),
        make_pair ( "Zaragoza", 1 )
      }) );
      assert ( lines . Find ( "Omsk", 4 ) == (map<string,int>
      {
        make_pair ( "Berlin", 2 ),
        make_pair ( "Dresden", 3 ),
        make_pair ( "Irkutsk", 1 ),
        make_pair ( "Kiev", 1 ),
        make_pair ( "Linz", 2 ),
        make_pair ( "Moscow", 1 ),
        make_pair ( "Munchen", 2 ),
        make_pair ( "Omsk", 0 ),
        make_pair ( "Paris", 4 ),
        make_pair ( "Prague", 1 ),
        make_pair ( "Vladivostok", 1 ),
        make_pair ( "Wien", 2 )
      }) );
      assert ( lines . Find ( "Moscow", 10, TrainFilterCompany ( { "RZD", "DB" } ) ) == (map<string,int>
      {
        make_pair ( "Berlin", 2 ),
        make_pair ( "Dresden", 3 ),
        make_pair ( "Irkutsk", 1 ),
        make_pair ( "Kiev", 1 ),
        make_pair ( "Linz", 5 ),
        make_pair ( "Moscow", 0 ),
        make_pair ( "Munchen", 4 ),
        make_pair ( "Omsk", 1 ),
        make_pair ( "Prague", 1 ),
        make_pair ( "Vladivostok", 1 )
      }) );
    #endif /* MULTIPLE_STOPS */
    return 0;
}
#endif  /* __PROGTEST__ */



