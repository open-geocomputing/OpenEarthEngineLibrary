var eeNames={
  "AbstractOverlay": {
    "ua": "ee.AbstractOverlay.ua",
    "base": "ee.AbstractOverlay.base"
  },
  "api": {
    "ListAssetsResponse": "ee.api.ListAssetsResponse",
    "EarthEngineAsset": "ee.api.EarthEngineAsset",
    "ListImagesResponse": "ee.api.ListImagesResponse",
    "Image": "ee.api.Image",
    "Operation": "ee.api.Operation"
  },
  "Serializer": {
    "encode": "ee.Serializer.encode",
    "toJSON": "ee.Serializer.toJSON",
    "toReadableJSON": "ee.Serializer.toReadableJSON",
    "encodeCloudApi": "ee.Serializer.encodeCloudApi",
    "encodeCloudApiPretty": "ee.Serializer.encodeCloudApiPretty",
    "toCloudApiJSON": "ee.Serializer.toCloudApiJSON",
    "toReadableCloudApiJSON": "ee.Serializer.toReadableCloudApiJSON"
  },
  "data": {
    "authenticateViaOauth": "ee.data.authenticateViaOauth",
    "authenticate": "ee.data.authenticate",
    "authenticateViaPopup": "ee.data.authenticateViaPopup",
    "authenticateViaPrivateKey": "ee.data.authenticateViaPrivateKey",
    "setExpressionAugmenter": "ee.data.setExpressionAugmenter",
    "setAuthToken": "ee.data.setAuthToken",
    "refreshAuthToken": "ee.data.refreshAuthToken",
    "setAuthTokenRefresher": "ee.data.setAuthTokenRefresher",
    "getAuthToken": "ee.data.getAuthToken",
    "clearAuthToken": "ee.data.clearAuthToken",
    "getAuthClientId": "ee.data.getAuthClientId",
    "getAuthScopes": "ee.data.getAuthScopes",
    "setDeadline": "ee.data.setDeadline",
    "setParamAugmenter": "ee.data.setParamAugmenter",
    "getMapId": "ee.data.getMapId",
    "getTileUrl": "ee.data.getTileUrl",
    "computeValue": "ee.data.computeValue",
    "getThumbId": "ee.data.getThumbId",
    "getVideoThumbId": "ee.data.getVideoThumbId",
    "getFilmstripThumbId": "ee.data.getFilmstripThumbId",
    "makeThumbUrl": "ee.data.makeThumbUrl",
    "getDownloadId": "ee.data.getDownloadId",
    "makeDownloadUrl": "ee.data.makeDownloadUrl",
    "getTableDownloadId": "ee.data.getTableDownloadId",
    "makeTableDownloadUrl": "ee.data.makeTableDownloadUrl",
    "newTaskId": "ee.data.newTaskId",
    "getTaskStatus": "ee.data.getTaskStatus",
    "getTaskList": "ee.data.getTaskList",
    "getTaskListWithLimit": "ee.data.getTaskListWithLimit",
    "listOperations": "ee.data.listOperations",
    "cancelOperation": "ee.data.cancelOperation",
    "getOperation": "ee.data.getOperation",
    "cancelTask": "ee.data.cancelTask",
    "updateTask": "ee.data.updateTask",
    "startProcessing": "ee.data.startProcessing",
    "startIngestion": "ee.data.startIngestion",
    "startTableIngestion": "ee.data.startTableIngestion",
    "getAsset": "ee.data.getAsset",
    "getInfo": "ee.data.getInfo",
    "getList": "ee.data.getList",
    "listAssets": "ee.data.listAssets",
    "listImages": "ee.data.listImages",
    "listBuckets": "ee.data.listBuckets",
    "getAssetRoots": "ee.data.getAssetRoots",
    "createAssetHome": "ee.data.createAssetHome",
    "createAsset": "ee.data.createAsset",
    "createFolder": "ee.data.createFolder",
    "renameAsset": "ee.data.renameAsset",
    "copyAsset": "ee.data.copyAsset",
    "deleteAsset": "ee.data.deleteAsset",
    "getAssetAcl": "ee.data.getAssetAcl",
    "updateAsset": "ee.data.updateAsset",
    "setAssetAcl": "ee.data.setAssetAcl",
    "setAssetProperties": "ee.data.setAssetProperties",
    "getAssetRootQuota": "ee.data.getAssetRootQuota",
    "getProject": "ee.data.getProject",
    "initialize": "ee.data.initialize",
    "reset": "ee.data.reset",
    "setApiKey": "ee.data.setApiKey",
    "setAppIdToken": "ee.data.setAppIdToken",
    "setProject": "ee.data.setProject",
    "setupMockSend": "ee.data.setupMockSend"
  },
  "ComputedObject": {
    "ua": "ee.ComputedObject.ua",
    "base": "ee.ComputedObject.base"
  },
  "Function": {
    "ua": "ee.Function.ua",
    "base": "ee.Function.base"
  },
  "ApiFunction": {
    "ua": "ee.ApiFunction.ua",
    "base": "ee.ApiFunction.base",
    "_call": "ee.ApiFunction._call",
    "_apply": "ee.ApiFunction._apply",
    "lookup": "ee.ApiFunction.lookup"
  },
  "Element": {
    "ua": "ee.Element.ua",
    "base": "ee.Element.base"
  },
  "Geometry": {
    "ua": "ee.Geometry.ua",
    "base": "ee.Geometry.base",
    "Point": "ee.Geometry.Point",
    "MultiPoint": "ee.Geometry.MultiPoint",
    "Rectangle": "ee.Geometry.Rectangle",
    "BBox": "ee.Geometry.BBox",
    "LineString": "ee.Geometry.LineString",
    "LinearRing": "ee.Geometry.LinearRing",
    "MultiLineString": "ee.Geometry.MultiLineString",
    "Polygon": "ee.Geometry.Polygon",
    "MultiPolygon": "ee.Geometry.MultiPolygon"
  },
  "Filter": {
    "ua": "ee.Filter.ua",
    "base": "ee.Filter.base",
    "eq": "ee.Filter.eq",
    "neq": "ee.Filter.neq",
    "lt": "ee.Filter.lt",
    "gte": "ee.Filter.gte",
    "gt": "ee.Filter.gt",
    "lte": "ee.Filter.lte",
    "and": "ee.Filter.and",
    "or": "ee.Filter.or",
    "date": "ee.Filter.date",
    "inList": "ee.Filter.inList",
    "bounds": "ee.Filter.bounds",
    "metadata": "ee.Filter.metadata",
    "dateRangeContains": "ee.Filter.dateRangeContains",
    "hasGeometry": "ee.Filter.hasGeometry",
    "always": "ee.Filter.always",
    "never": "ee.Filter.never",
    "notNull": "ee.Filter.notNull",
    "equals": "ee.Filter.equals",
    "notEquals": "ee.Filter.notEquals",
    "lessThan": "ee.Filter.lessThan",
    "greaterThanOrEquals": "ee.Filter.greaterThanOrEquals",
    "greaterThan": "ee.Filter.greaterThan",
    "lessThanOrEquals": "ee.Filter.lessThanOrEquals",
    "stringStartsWith": "ee.Filter.stringStartsWith",
    "stringEndsWith": "ee.Filter.stringEndsWith",
    "stringContains": "ee.Filter.stringContains",
    "listContains": "ee.Filter.listContains",
    "dayOfYear": "ee.Filter.dayOfYear",
    "calendarRange": "ee.Filter.calendarRange",
    "rangeContains": "ee.Filter.rangeContains",
    "contains": "ee.Filter.contains",
    "isContained": "ee.Filter.isContained",
    "maxDifference": "ee.Filter.maxDifference",
    "intersects": "ee.Filter.intersects",
    "disjoint": "ee.Filter.disjoint",
    "withinDistance": "ee.Filter.withinDistance",
    "expression": "ee.Filter.expression"
  },
  "Collection": {
    "ua": "ee.Collection.ua",
    "base": "ee.Collection.base",
    "fromColumns": "ee.Collection.fromColumns",
    "loadTable": "ee.Collection.loadTable"
  },
  "Feature": {
    "ua": "ee.Feature.ua",
    "base": "ee.Feature.base"
  },
  "Image": {
    "ua": "ee.Image.ua",
    "base": "ee.Image.base",
    "rgb": "ee.Image.rgb",
    "cat": "ee.Image.cat",
    "constant": "ee.Image.constant",
    "load": "ee.Image.load",
    "loadGeoTIFF": "ee.Image.loadGeoTIFF",
    "parseExpression": "ee.Image.parseExpression",
    "pixelArea": "ee.Image.pixelArea",
    "pixelCoordinates": "ee.Image.pixelCoordinates",
    "pixelLonLat": "ee.Image.pixelLonLat",
    "random": "ee.Image.random",
    "matrixIdentity": "ee.Image.matrixIdentity"
  },
  "List": {
    "ua": "ee.List.ua",
    "base": "ee.List.base",
    "repeat": "ee.List.repeat",
    "sequence": "ee.List.sequence"
  },
  "FeatureCollection": {
    "ua": "ee.FeatureCollection.ua",
    "base": "ee.FeatureCollection.base",
    "randomPoints": "ee.FeatureCollection.randomPoints"
  },
  "ImageCollection": {
    "ua": "ee.ImageCollection.ua",
    "base": "ee.ImageCollection.base",
    "load": "ee.ImageCollection.load",
    "fromImages": "ee.ImageCollection.fromImages"
  },
  "Number": {
    "ua": "ee.Number.ua",
    "base": "ee.Number.base",
    "clamp": "ee.Number.clamp",
    "parse": "ee.Number.parse",
    "unitScale": "ee.Number.unitScale",
    "expression": "ee.Number.expression"
  },
  "String": {
    "ua": "ee.String.ua",
    "base": "ee.String.base",
    "encodeJSON": "ee.String.encodeJSON"
  },
  "CustomFunction": {
    "ua": "ee.CustomFunction.ua",
    "base": "ee.CustomFunction.base"
  },
  "Date": {
    "ua": "ee.Date.ua",
    "base": "ee.Date.base",
    "fromYMD": "ee.Date.fromYMD",
    "parse": "ee.Date.parse",
    "unitRatio": "ee.Date.unitRatio"
  },
  "Deserializer": {
    "fromJSON": "ee.Deserializer.fromJSON",
    "decode": "ee.Deserializer.decode",
    "fromCloudApiJSON": "ee.Deserializer.fromCloudApiJSON",
    "decodeCloudApi": "ee.Deserializer.decodeCloudApi"
  },
  "Dictionary": {
    "ua": "ee.Dictionary.ua",
    "base": "ee.Dictionary.base",
    "fromLists": "ee.Dictionary.fromLists"
  },
  "Terrain": {
    "dB": "ee.Terrain.dB",
    "initialize": "ee.Terrain.initialize",
    "reset": "ee.Terrain.reset",
    "products": "ee.Terrain.products",
    "aspect": "ee.Terrain.aspect",
    "hillshade": "ee.Terrain.hillshade",
    "hillShadow": "ee.Terrain.hillShadow",
    "fillMinima": "ee.Terrain.fillMinima",
    "slope": "ee.Terrain.slope"
  },
  "initialize": {},
  "reset": {},
  "InitState": {
    "j6a": "ee.InitState.j6a",
    "LOADING": "ee.InitState.LOADING",
    "l7a": "ee.InitState.l7a",
    "NOT_READY": "ee.InitState.NOT_READY",
    "READY": "ee.InitState.READY"
  },
  "TILE_SIZE": {},
  "Algorithms": {
    "signature": "ee.Algorithms.signature",
    "CannyEdgeDetector": "ee.Algorithms.CannyEdgeDetector",
    "Collection": "ee.Algorithms.Collection",
    "CrossCorrelation": "ee.Algorithms.CrossCorrelation",
    "Date": "ee.Algorithms.Date",
    "Describe": "ee.Algorithms.Describe",
    "Dictionary": "ee.Algorithms.Dictionary",
    "FMask": "ee.Algorithms.FMask",
    "Feature": "ee.Algorithms.Feature",
    "GeometryConstructors": "ee.Algorithms.GeometryConstructors",
    "HillShadow": "ee.Algorithms.HillShadow",
    "HoughTransform": "ee.Algorithms.HoughTransform",
    "If": "ee.Algorithms.If",
    "Image": "ee.Algorithms.Image",
    "IsEqual": "ee.Algorithms.IsEqual",
    "Landsat": "ee.Algorithms.Landsat",
    "ObjectType": "ee.Algorithms.ObjectType",
    "Proj": "ee.Algorithms.Proj",
    "ProjectionTransform": "ee.Algorithms.ProjectionTransform",
    "Sentinel2": "ee.Algorithms.Sentinel2",
    "String": "ee.Algorithms.String",
    "TemporalSegmentation": "ee.Algorithms.TemporalSegmentation",
    "Terrain": "ee.Algorithms.Terrain"
  },
  "call": {},
  "apply": {},
  "FloatTileOverlay": {
    "ua": "ee.FloatTileOverlay.ua"
  },
  "layers": {
    "AbstractOverlay": "ee.layers.AbstractOverlay",
    "BinaryOverlay": "ee.layers.BinaryOverlay",
    "ImageOverlay": "ee.layers.ImageOverlay",
    "CloudStorageTileSource": "ee.layers.CloudStorageTileSource",
    "EarthEngineTileSource": "ee.layers.EarthEngineTileSource"
  },
  "MapTileManager": {
    "ua": "ee.MapTileManager.ua",
    "aha": "ee.MapTileManager.aha",
    "lc": "ee.MapTileManager.lc"
  },
  "MapLayerOverlay": {
    "ua": "ee.MapLayerOverlay.ua"
  },
  "SavedFunction": {
    "ua": "ee.SavedFunction.ua",
    "base": "ee.SavedFunction.base"
  },
  "Classifier": {
    "ua": "ee.Classifier.ua",
    "base": "ee.Classifier.base",
    "naiveBayes": "ee.Classifier.naiveBayes",
    "gmoLinearRegression": "ee.Classifier.gmoLinearRegression",
    "cart": "ee.Classifier.cart",
    "gmoMaxEnt": "ee.Classifier.gmoMaxEnt",
    "ikpamir": "ee.Classifier.ikpamir",
    "continuousNaiveBayes": "ee.Classifier.continuousNaiveBayes",
    "pegasos": "ee.Classifier.pegasos",
    "pegasosGaussian": "ee.Classifier.pegasosGaussian",
    "pegasosLinear": "ee.Classifier.pegasosLinear",
    "pegasosPolynomial": "ee.Classifier.pegasosPolynomial",
    "perceptron": "ee.Classifier.perceptron",
    "randomForest": "ee.Classifier.randomForest",
    "winnow": "ee.Classifier.winnow",
    "svm": "ee.Classifier.svm",
    "amnhMaxent": "ee.Classifier.amnhMaxent",
    "decisionTree": "ee.Classifier.decisionTree",
    "decisionTreeEnsemble": "ee.Classifier.decisionTreeEnsemble",
    "libsvm": "ee.Classifier.libsvm",
    "minimumDistance": "ee.Classifier.minimumDistance",
    "smileCart": "ee.Classifier.smileCart",
    "smileGradientTreeBoost": "ee.Classifier.smileGradientTreeBoost",
    "smileNaiveBayes": "ee.Classifier.smileNaiveBayes",
    "smileRandomForest": "ee.Classifier.smileRandomForest",
    "spectralRegion": "ee.Classifier.spectralRegion",
    "signature": "ee.Classifier.signature"
  },
  "Clusterer": {
    "ua": "ee.Clusterer.ua",
    "base": "ee.Clusterer.base",
    "wekaCascadeKMeans": "ee.Clusterer.wekaCascadeKMeans",
    "wekaCobweb": "ee.Clusterer.wekaCobweb",
    "wekaKMeans": "ee.Clusterer.wekaKMeans",
    "wekaLVQ": "ee.Clusterer.wekaLVQ",
    "wekaXMeans": "ee.Clusterer.wekaXMeans",
    "signature": "ee.Clusterer.signature"
  },
  "DateRange": {
    "ua": "ee.DateRange.ua",
    "base": "ee.DateRange.base",
    "unbounded": "ee.DateRange.unbounded",
    "signature": "ee.DateRange.signature"
  },
  "ErrorMargin": {
    "ua": "ee.ErrorMargin.ua",
    "base": "ee.ErrorMargin.base",
    "signature": "ee.ErrorMargin.signature"
  },
  "PixelType": {
    "ua": "ee.PixelType.ua",
    "base": "ee.PixelType.base",
    "double": "ee.PixelType.double",
    "float": "ee.PixelType.float",
    "int16": "ee.PixelType.int16",
    "int32": "ee.PixelType.int32",
    "int64": "ee.PixelType.int64",
    "int8": "ee.PixelType.int8",
    "uint16": "ee.PixelType.uint16",
    "uint32": "ee.PixelType.uint32",
    "uint8": "ee.PixelType.uint8",
    "signature": "ee.PixelType.signature"
  },
  "SelectorSet": {
    "ua": "ee.SelectorSet.ua",
    "base": "ee.SelectorSet.base",
    "Object": "ee.SelectorSet.Object",
    "Geometry": "ee.SelectorSet.Geometry",
    "Simple": "ee.SelectorSet.Simple",
    "signature": "ee.SelectorSet.signature"
  },
  "Kernel": {
    "ua": "ee.Kernel.ua",
    "base": "ee.Kernel.base",
    "diamond": "ee.Kernel.diamond",
    "square": "ee.Kernel.square",
    "rectangle": "ee.Kernel.rectangle",
    "octagon": "ee.Kernel.octagon",
    "plus": "ee.Kernel.plus",
    "cross": "ee.Kernel.cross",
    "circle": "ee.Kernel.circle",
    "euclidean": "ee.Kernel.euclidean",
    "manhattan": "ee.Kernel.manhattan",
    "chebyshev": "ee.Kernel.chebyshev",
    "laplacian4": "ee.Kernel.laplacian4",
    "laplacian8": "ee.Kernel.laplacian8",
    "sobel": "ee.Kernel.sobel",
    "roberts": "ee.Kernel.roberts",
    "prewitt": "ee.Kernel.prewitt",
    "compass": "ee.Kernel.compass",
    "kirsch": "ee.Kernel.kirsch",
    "gaussian": "ee.Kernel.gaussian",
    "fixed": "ee.Kernel.fixed",
    "signature": "ee.Kernel.signature"
  },
  "ConfusionMatrix": {
    "ua": "ee.ConfusionMatrix.ua",
    "base": "ee.ConfusionMatrix.base",
    "signature": "ee.ConfusionMatrix.signature"
  },
  "Join": {
    "ua": "ee.Join.ua",
    "base": "ee.Join.base",
    "simple": "ee.Join.simple",
    "inverted": "ee.Join.inverted",
    "saveFirst": "ee.Join.saveFirst",
    "saveBest": "ee.Join.saveBest",
    "saveAll": "ee.Join.saveAll",
    "inner": "ee.Join.inner",
    "signature": "ee.Join.signature"
  },
  "Projection": {
    "ua": "ee.Projection.ua",
    "base": "ee.Projection.base",
    "signature": "ee.Projection.signature"
  },
  "Blob": {
    "ua": "ee.Blob.ua",
    "base": "ee.Blob.base",
    "signature": "ee.Blob.signature"
  },
  "Array": {
    "ua": "ee.Array.ua",
    "base": "ee.Array.base",
    "bitsToArray": "ee.Array.bitsToArray",
    "cat": "ee.Array.cat",
    "identity": "ee.Array.identity",
    "signature": "ee.Array.signature"
  },
  "Model": {
    "ua": "ee.Model.ua",
    "base": "ee.Model.base",
    "fromAiPlatformPredictor": "ee.Model.fromAiPlatformPredictor",
    "signature": "ee.Model.signature"
  },
  "Reducer": {
    "ua": "ee.Reducer.ua",
    "base": "ee.Reducer.base",
    "minMax": "ee.Reducer.minMax",
    "countEvery": "ee.Reducer.countEvery",
    "count": "ee.Reducer.count",
    "sum": "ee.Reducer.sum",
    "mean": "ee.Reducer.mean",
    "product": "ee.Reducer.product",
    "bitwiseOr": "ee.Reducer.bitwiseOr",
    "bitwiseAnd": "ee.Reducer.bitwiseAnd",
    "allNonZero": "ee.Reducer.allNonZero",
    "anyNonZero": "ee.Reducer.anyNonZero",
    "linearFit": "ee.Reducer.linearFit",
    "stdDev": "ee.Reducer.stdDev",
    "sampleStdDev": "ee.Reducer.sampleStdDev",
    "variance": "ee.Reducer.variance",
    "sampleVariance": "ee.Reducer.sampleVariance",
    "skew": "ee.Reducer.skew",
    "kurtosis": "ee.Reducer.kurtosis",
    "first": "ee.Reducer.first",
    "firstNonNull": "ee.Reducer.firstNonNull",
    "last": "ee.Reducer.last",
    "lastNonNull": "ee.Reducer.lastNonNull",
    "frequencyHistogram": "ee.Reducer.frequencyHistogram",
    "countDistinct": "ee.Reducer.countDistinct",
    "countDistinctNonNull": "ee.Reducer.countDistinctNonNull",
    "countRuns": "ee.Reducer.countRuns",
    "histogramCombiner": "ee.Reducer.histogramCombiner",
    "autoHistogram": "ee.Reducer.autoHistogram",
    "centeredCovariance": "ee.Reducer.centeredCovariance",
    "covariance": "ee.Reducer.covariance",
    "fixedHistogram": "ee.Reducer.fixedHistogram",
    "fixed2DHistogram": "ee.Reducer.fixed2DHistogram",
    "geometricMedian": "ee.Reducer.geometricMedian",
    "histogram": "ee.Reducer.histogram",
    "intervalMean": "ee.Reducer.intervalMean",
    "kendallsCorrelation": "ee.Reducer.kendallsCorrelation",
    "linearRegression": "ee.Reducer.linearRegression",
    "max": "ee.Reducer.max",
    "median": "ee.Reducer.median",
    "min": "ee.Reducer.min",
    "mode": "ee.Reducer.mode",
    "pearsonsCorrelation": "ee.Reducer.pearsonsCorrelation",
    "percentile": "ee.Reducer.percentile",
    "ridgeRegression": "ee.Reducer.ridgeRegression",
    "robustLinearRegression": "ee.Reducer.robustLinearRegression",
    "sensSlope": "ee.Reducer.sensSlope",
    "spearmansCorrelation": "ee.Reducer.spearmansCorrelation",
    "toCollection": "ee.Reducer.toCollection",
    "toList": "ee.Reducer.toList",
    "and": "ee.Reducer.and",
    "or": "ee.Reducer.or",
    "signature": "ee.Reducer.signature"
  },
  "arguments": {}
}

function constructTree(obj){
  var val1={};
  if(Object.keys(obj).length>1)
  {
    Object.keys(obj).map(function(st1){
      var val2={};
      Object.keys(obj[st1]).map(function(st2){
        val2[st2]=function(){return "ee."+st1+"."+st2+"()"};
      })
      val1[st1]=val2;
    });
    return val1;
  }
  else{
    return obj;
  }
}

module.exports=constructTree(eeNames);