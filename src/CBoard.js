"use client";

import React from 'react'
import { useState } from 'react';
import CTile from './CTile';


export default function CBoard(props) {
	var [CameraPos, setCameraPos] = useState({x:0, y:0});	
	var tileRenders = [];

	var GameState = props.gamestate;
	var tiles = GameState.Tiles;

	for (var j=0; j<3; j++)	
	{
		var row = [];
		for (var i=0; i<5; i++)
		{
			row.push(tiles[i+j*5]);
		}
		tileRenders.push(row);
	}
	return (
		<div>
			{tileRenders.map((row, index) => (
				<div className="tileRow">
				{
					row.map((tile, idx) => (					
					<CTile gamestate={GameState} tile={tile} key={index*5+idx}/>					
				))}
				</div>
			))}
		</div>
  )
}
