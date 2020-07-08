var app = angular.module('app', []).config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

//Servicio para compartir funciones entre controladores
app.service('service_atras', function($window) {
this.ir_atras = function()
{
	console.log("Atras");
	$window.history.back();
}
	
});

  
  
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////CONFIGURACION////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////



app.controller('facturacion', function($scope, $http, $window, $timeout,service_atras) {

let date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let hoy;
if(month < 10){
   hoy =`${year}-0${month}-${day}`;
}else{
  hoy = `${year}-${month}-${month}`;
}

var isId=false;
var no_factura;
var url = window.location.href;
var arr_ = url.split("?");
$scope.btn_imprimir=true;
$scope.btn_guardar=true;

if(!(arr_[1] === undefined))
{
	no_factura = arr_[1].split("=")[1];
	console.log(no_factura);

	if ( arr_[1] === undefined )
	{
		console.log("NO ID");
		
	}
		
	else {
		console.log("SI HAY ID");
		if(!isNaN(no_factura) ){
			console.log("Es numero");
			isId=true;
			
			
		}
			
	}
}
else
{
	$scope.btn_guardar=false;
}
	

	$scope.show_secuencia_inicial = isId;

if(isId)
{
	console.log("Cambio boton IMRPIMRI");
	$scope.btn_imprimir=false;

	
	$scope.factura_secuencia = no_factura;
	$http({
		  method: 'POST',
		  url: 'busquedas.php',
		  data: {'action':"fetch_factura", "no_factura":no_factura}

		}).then(function successCallback(response) {
			console.log(response.data);
			$scope.cliente_nombre = response.data.personal.nombre;
			$scope.cliente_ci = response.data.personal.identificacion;
			$scope.fecha_factura = response.data.personal.fecha_emision;
			
			var productos = response.data.productos;
			var i;
			for(i=0;i<productos.length;i++)
			{
				var cantidad = productos[i].cantidad;
				var p_unitario = productos[i].p_unitario;
				$("#c_c"+i).val(cantidad);
				$("#c_d"+i).val(productos[i].nombre);
				$("#pr_id"+i).val(p_unitario);
				var total = parseFloat(cantidad*p_unitario).toFixed(2);
				$("#c_t"+i).val(total);
				$scope.buscar_cambios();
				
			}
			
			
			
			$("#fecha_factura").val(response.data.personal.fecha_emision);
		}, function errorCallback(response) {
			console.log(response);
		  alert("Error");
		});
		
		
}






$("#fecha_factura").val(hoy);

 $scope.productos = [
 {id:0,id_desc:'pr_id0',d_desc:'c_d0', cant:'c_c0', total:'c_t0'},
 {id:1,id_desc:'pr_id1',d_desc:'c_d1', cant:'c_c1', total:'c_t1'},
 ];
 
 $scope.data = ['pr_id0', 'pr_id1', 'c_c0', 'c_c1', 'c_t0', 'c_t1' ];
 
 
this.busquedas = [];

$scope.buscar = function(clase, subclase){
	console.log(clase);
	$('#myModal').modal('show');
	$scope.clase = clase;
	console.log("Subclase: "+subclase);
	
		$scope.subclase=subclase;
	
	$http({
		  method: 'POST',
		  url: 'busqueda',
		  data: {'action':$scope.clase, 'subaction':$scope.subclase}

		}).then(function successCallback(response) {
			console.log(response.data);
			$scope.lista = response.data.resultado;
			$scope.flag = true;

		}, function errorCallback(response) {
			console.log(response);
		  alert("Error");
		});
	
	
	
		
}


$scope.seleccionar = function(clase){
	console.log(clase);
	$scope.busqueda = "";
};



//$scope.$watchGroup([''])

$scope.$watch('opciones_busqueda',function(newValue, oldValue){
	var precio_unitario = 0;
	var cantidad = 0;
	console.log('being watched oldValue:', oldValue, 'newValue:', newValue);
	if(newValue)
	if(($scope.clase   ) && $scope.flag) 
	{
		console.log($scope.subclase);
		$scope.flag = !$scope.flag;
		clase = $scope.clase;
		if($scope.subclase)
			subclase = $scope.subclase;
		seleccionado = $scope.opciones_busqueda;
		console.log("Clase: "+clase+" Opcion Seleccionada: "+seleccionado);
		if(clase == "Cliente")
		{
			$http({
				method: 'POST',
				url: 'busqueda',
				data: {'action':'get_cliente', 'subaction':$scope.subclase, 'seleccion': seleccionado}
			}).then(function successCallback(response) {
				
				resultado = response.data.resultado;
				console.log(resultado.identificacion);
				if($scope.subclase=="nombre")
				{
					console.log("Escogio nombre");
					$scope.cliente_nombre = seleccionado;
					$scope.cliente_ci = resultado.identificacion;
				}
				if($scope.subclase=="cedula")
				{
					console.log("Escogio Ceudla");
					$scope.cliente_ci = seleccionado;
					$scope.cliente_nombre = resultado.nombre;
				}
				$('#myModal').modal('hide');
				//$scope.c_nombre_checked=true;
				//$scope.c_ci_checked=true;
			}, function errorCallback(response) {
				console.log(response);
			  alert("Error. Error");
			});
			
		}
		
		if(clase == "Producto")
		{
			$http({
				method: 'POST',
				url: 'busquedas.php',
				data: {'action':'get_producto', 'seleccion': seleccionado}
			}).then(function successCallback(response) {
				
				resultado = response.data.resultado;
				console.log(resultado);
				console.log("#pr_id"+$scope.subclase);
				console.log("#c_c"+$scope.subclase);
				precio_unitario = resultado.precio_unitario;
				console.log("Precio unitario "+precio_unitario);
			
				cantidad = $("#c_c"+$scope.subclase).val();
				console.log("Cantidad "+cantidad);
				
			//$("#pr_id"+$scope.subclase).val(resultado.precio_unitario);
				$("#pr_id"+$scope.subclase).val(resultado.precio_unitario);
				$("#c_d"+$scope.subclase).val(resultado.nombre);
				
				$scope.sumar_row($scope.subclase, precio_unitario, cantidad);
				
				$scope.sumar_all($scope.productos.length);
				
				
				$('#myModal').modal('hide');		
			}, function errorCallback(response) {
				console.log(response);
			  alert("Error. Error");
			});
			
		}
		
		
		
		
		
		
		
	}
    });
	
	
$scope.buscar_cambios = function()
{
		console.log("Cambiando valor");
	for(i=0;i<$scope.productos.length;i++){
		var tmp_c = $("#c_c"+i).val();
		var tmp_pu = $("#pr_id"+i).val();
		if(tmp_c != "" && tmp_pu!="")
			$scope.sumar_row(i, tmp_c, tmp_pu);
	}
	$scope.sumar_all($scope.productos.length);

};

	
	
	

$scope.sumar_all = function(total_rows)
{
	var i;
	var total = 0;
	for(i=0;i<total_rows;i++)
	{
		var t = $("#c_t"+i).val();
		if( t!="" )
		{
			t = parseFloat(t).toFixed(2);
			total += parseFloat(t);
			console.log("Sumando "+i+": "+parseFloat(total).toFixed(2));
		}
	}
	//$scope.factura_total = parseFloat(total).toFixed(2);
	$scope.subtotal_12_iva = parseFloat(total).toFixed(2);
	
	$scope.descuento = parseFloat($scope.subtotal_12_iva*0.01).toFixed(2);
	$scope.factura_total = parseFloat($scope.subtotal_12_iva) + parseFloat($scope.iva_12) - parseFloat($scope.descuento);
	$scope.subtotal = $scope.subtotal_12_iva - $scope.descuento;
	$scope.subtotal = parseFloat($scope.subtotal).toFixed(2);
	
	$scope.iva_12 = parseFloat($scope.subtotal*0.12).toFixed(2);
	
	$scope.factura_total = parseFloat($scope.subtotal *1.12 ).toFixed(2);
	console.log("Total $ productos"+parseFloat(total).toFixed(2));
}


 



$scope.sumar_row = function(id, precio_unitario, cantidad)
{
		var p_u = parseFloat(precio_unitario).toFixed(2);
		var p_c = parseFloat(cantidad).toFixed(2);
		console.log("P.U, P.Cant");
		console.log(p_u);
		console.log(p_c);
		var p_t = p_c * p_u;
		$("#c_t"+id).val(p_t);
		
};

$scope.atras = function(){
				service_atras.ir_atras();
	};
	
  $scope.enviar = function(service_atras) {
    //$http POST function
	
    $http({
      method: 'POST',
      url: 'mantenimiento.php',
      data: {'id':$scope.configuracion_id, 'establecimiento':$scope.configuracion_establecimiento, 'punto_emision':$scope.configuracion_punto_emision, 'sec_factura':$scope.configuracion_sec_factura, 'action':'mantenimiento_configuracion_put'}

    }).then(function successCallback(response) {
	console.log(response.data);
	  $scope.message = response.data.message;
	  $scope.ver = response.data.sucess;
	  
	  $timeout(function () {
     $scope.ver = !response.data.sucess;
  }, 2000);

    }, function errorCallback(response) {
		console.log(response);
      alert("Error. Error al enviar datos!");
    });

  };
  
 
$scope.imprimir_facturacion = function()
{
	
	 
	 html2canvas(document.getElementById('exportthis'), {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500,
                    }]
                };
				from = new Date();
				var df= from.getFullYear() + "-" + (from.getMonth() + 1) + "-" + (from.getDate());
                pdfMake.createPdf(docDefinition).download("factura"+df+".pdf");
            }
        });
    
}

		
	
$scope.finalizar_facturacion = function(){
	 console.log("Guardando");
	 
	 
	productos = [];
	factura = [];
 
	for(i=0;i<$scope.productos.length;i++){
		var tmp_c = $("#c_c"+i).val();
		var tmp_d = $("#c_d"+i).val();
		var tmp_pu = $("#pr_id"+i).val();
		if(tmp_c != "" && tmp_pu!="" && tmp_d!=""){
			var a = [{cantidad:tmp_c, descripcion:tmp_d, precio_unitario:tmp_pu}];
			productos.push(a);
		}
	}
	
	var fecha = $("#fecha_factura").val();
	var b = {cedula:$scope.cliente_ci,fecha_emision:fecha};
	factura.push({"Productos":productos});
	factura.push({"Datos":b});
	
	console.log(factura);
		 
	
	$http({
		method: 'POST',
		url: 'busquedas.php',
		data: {'action':'guardar_factura', 'factura':factura}

		}).then(function successCallback(response) {
			console.log(response.data);
			$scope.show_secuencia_inicial = true;
			$scope.factura_secuencia = response.data.secuencia;
			$scope.lista = response.data.resultado;
			$scope.flag = true;
			$scope.btn_guardar = true;
			$scope.btn_imprimir = false;


		}, function errorCallback(response) {
			console.log(response);
			alert("Error");
		});
	 
 };
		
  
  
  
  
});