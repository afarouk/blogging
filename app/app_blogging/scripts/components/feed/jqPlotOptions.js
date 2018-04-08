'use strict';

module.exports = {
	options: {
		"animate":true,
		"captureRightClick":true,
		"grid":{  
			"shadow":false
		},
		"seriesColors":[],
		"axes":{  
			"xaxis":{  
			"showTicks":false,
			"drawMajorGridlines":false
			},
			"yaxis":{  
			"showTicks":true,
			"drawMajorGridlines":true,
			"rendererOptions":{  
				"tickOptions":{  
					 "mark":null,
					 "fontSize":14
				}
			},
			"ticks":[]
			}
		},
		"seriesDefaults":{
			"shadow":false,
			"rendererOptions":{  
			"varyBarColor":true,
			"barDirection":"horizontal",
			"barPadding":0,
			"barMargin":0,
			"barWidth":18,
			"highlightMouseDown":true
			},
			"pointLabels":{
			"show":true,
			"stacked":true,
			"formatString": "%d"
			}
		}
	},

    colorChoices: [
        '#85802b',
        '#00749F',
        '#73C774',
        '#C7754C',
        '#17BDB8',
        '#C157C8',
        '#639E44',
        '#C14D3B',
        '#51878A',
        '#AF527A',
        '#7476BB',
        '#A67C33'
    ]
};
