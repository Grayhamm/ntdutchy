

import React, { useState } from 'react'
import CBoard from './CBoard'
import { Resource, STile } from './CTile';
import CActionBar from './CActionBar';
import { FeedPhaseClicked } from './FeedPhase';
import { SGameState } from './SGameState';

function DrawOneFrom(arr)
{
	return arr[Math.floor(Math.random()*arr.length)];
}

function Shuffle(arr, passes)
{
	for (var pass=0; pass<passes; pass++)
	{
		for (var i=0; i<arr.length; i++)
			for (var j=i+1; j<arr.length; j++)
			{
				if (Math.random() < 0.5)
				{
					var tmp = arr[i];
					arr[i] = arr[j];
					arr[j] = tmp;
				}
			}
	}
}

export function BuildTerrainMap()
{
  var tiles = [];

  var rowWidths = [2, 5, 2];
  var rowOffset = [1, 0, 2];

  var centralTiles = [];
  var allTiles = [4,5,6,7,8];
  var woodTiles = [4,5,6,7];
  var stoneTiles = [6,7,8];
  var metalTiles = [7,8];  

	while (centralTiles.length < 5)
	{
		var numMetals = 0;
		var numStone = 0;
		var numWood = 0;
		for (var tile of centralTiles)
		{
			if (metalTiles.indexOf(tile) >= 0)	
				numMetals += 1;

			if (stoneTiles.indexOf(tile) >= 0)	
				numStone += 1;

			if (woodTiles.indexOf(tile) >= 0)	
				numWood += 1;	
		}

		if (numMetals < 2)
		{
			centralTiles.push(DrawOneFrom(metalTiles));
			continue;
		}

		if (numStone < 2)
		{
			centralTiles.push(DrawOneFrom(stoneTiles));
			continue;
		}

		if (numWood < 2)
		{
			centralTiles.push(DrawOneFrom(woodTiles));
			continue;
		}

		centralTiles.push(DrawOneFrom(allTiles));
	}

	Shuffle(centralTiles, 100);

  
  for (var j=0; j<3; j++)
  {
    for (var i=0; i<5; i++)
    {	
			if (i === 2 && j === 0)	
			{
				var ekeep = new STile(2);
				ekeep.resHere[Resource.Food] = 6;			
				ekeep.fedWorkers[1] = 2;
				ekeep.soldiers[1] = 1;

				//temp
				/*ekeep.fedWorkers[0] = 1;
				ekeep.unfedWorkers[0] = 2;
				ekeep.soldiers[0] = 1;
				ekeep.resYield[Resource.Metal] = 2;*/

				tiles.push(ekeep);			
			}
			else if (i === 2 && j === 2)
			{
				var pkeep = new STile(1);
				pkeep.resHere[Resource.Food] = 6;			
				pkeep.fedWorkers[0] = 2;				
				pkeep.soldiers[0] = 1;
				tiles.push(pkeep);
			}				
			else if (i >= rowOffset[j] && i<rowOffset[j]+rowWidths[j])
			{
				if (j === 0 || j === 2)
					tiles.push(new STile(3));
				else
					tiles.push(new STile(centralTiles[i]));
			}
			else
			{
				tiles.push(new STile(0));
			}

		tiles[tiles.length-1].x = i;
		tiles[tiles.length-1].y = j;
    }
  }

  return SetMapYields(tiles);
}

function BindClickerToTiles(tiles, onTileClicked)
{
	for (var tile of tiles)
	{			
		if (tile.terrain === 0)
			continue;	

		tile.OnClick = onTileClicked.bind(null, tile);	
	}
}

function GetYieldFromTerrain(terrain)
{
	
}

function SetMapYields(tiles)
{
  for (var til of tiles)
  {
		//til.fedWorkers[0] = 2;
    if (til.terrain === 3) //farm
    {
      til.resYield[Resource.Food] = 4;	  
    }
		else if (til.terrain === 4) //grassland
		{
			til.resYield[Resource.Food] = 4;
			til.resYield[Resource.Wood] = 1;
		}
		else if (til.terrain === 5) //woods
		{
			til.resYield[Resource.Food] = 2;
			til.resYield[Resource.Wood] = 3;
		}
		else if (til.terrain === 6) //plains
		{
			til.resYield[Resource.Food] = 1;
			til.resYield[Resource.Wood] = 1;			
			til.resYield[Resource.Stone] = 1;
		}
		else if (til.terrain === 7) //hills
		{			
			til.resYield[Resource.Food] = 1;
			til.resYield[Resource.Stone] = 2;
			til.resYield[Resource.Metal] = 1;
		}
		else if (til.terrain === 8) //mountain
		{
			til.resYield[Resource.Wood] = 1;
			til.resYield[Resource.Stone] = 1;
			til.resYield[Resource.Metal] = 2;
		}
		else
		{
			//console.log("Unknown Tile: " + til.terrain);
		}	
  }
  return tiles;
}





function HandlePhase(phase)
{

}



export default function CGame() {

  //var [Tiles, setTiles] = useState(BuildTerrainMap());  	
	//var [TurnPhase, setTurnPhase] = useState(TP_FEED);
	var [GameState, setGameState] = useState(new SGameState());
	var [ForceRefresh, setForceRefresh] = useState([]);
	//var [PhaseInfo, setPhaseInfo] = {};	

	var fnForceUpdate = function () { setForceRefresh([]) };

	GameState.ForceUpdate = fnForceUpdate;

	var TileClicked = function(tile, resourceClicked, event)
	{	
		GameState.HandleClick(tile, resourceClicked);

		if (GameState.NeedsRefresh)
		{
						
			//setGameState({...GameState});			
			GameState.NeedsRefresh = false;
		}

		fnForceUpdate();
		event.stopPropagation();

		return false;
		
		//setGameState({...GameState});
		//BindClickerToTiles(GameState.tiles, TileClicked);
	}

	BindClickerToTiles(GameState.Tiles, TileClicked);
  return (
	<>
		<div className="centerThings">
			<CBoard gamestate={GameState}/>		
		</div>
		<CActionBar gamestate={GameState}/>
	</>
  )
}
