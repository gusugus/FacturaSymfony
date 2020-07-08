<?php

namespace Acme\TestBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class DefaultController extends Controller
{
    public function indexAction($name)
    {
        $users = $this->getDoctrine()->getRepository('AcmeTestBundle:Usuario')->findAll();
        return $this->render('AcmeTestBundle:Default:index.html.twig', array('name' => $name));
    }

    public function busquedaAction(Request $request)
    {
        $form_data = json_decode($request->getContent(), true);
        $output["message"] = "Incorrecto";

        if($form_data["action"] == 'Cliente')
        {
            if($form_data["subaction"] == 'nombre')
                $query = "SELECT nombre FROM cliente;";
            else if($form_data["subaction"] == 'cedula')
                $query = "SELECT identificacion as nombre FROM cliente;";
            

            
            $em= $this->getDoctrine()->getManager();
            $statement = $em->getConnection()->prepare($query);
            //$RAW_QUERY = 'SELECT * FROM my_table where my_table.field = :status LIMIT 5;';
            //$statement->bindValue('status', 1);
            $statement->execute();
            $result = $statement->fetchAll();
            
            $output["message"] = "Correcto";
            $output["resultado"] = $result;
            
            
        }
        else if($form_data["action"] == 'get_cliente')
        {
            if($form_data["subaction"] == 'nombre')
                $query = "SELECT nombre, identificacion FROM cliente where nombre = :texto";
            else if($form_data["subaction"] == 'cedula')
                $query = "SELECT nombre, identificacion FROM cliente where identificacion = :texto";
            
            $em= $this->getDoctrine()->getManager();
            $statement = $em->getConnection()->prepare($query);
            $statement->bindValue(':texto', $form_data["seleccion"]);
            $statement->execute($data);
            $result = $statement->fetch();
            $output["message"] = "Correcto";
            $output["resultado"] = $result;	
        }
        else if($form_data["action"] == 'Producto')
        {
         
            $query = "SELECT nombre FROM producto";
            $em= $this->getDoctrine()->getManager();
            $statement = $em->getConnection()->prepare($query);
            $statement->execute($data);
            $result = $statement->fetchAll();
            $output["message"] = "Correcto";
            $output["resultado"] = $result;
        }
        else if($form_data["action"] == 'get_producto')
        {
            $query = "SELECT nombre, precio_unitario FROM producto where nombre = :nombre";
            $em= $this->getDoctrine()->getManager();
            $statement = $em->getConnection()->prepare($query);
            $statement->bindValue(':nombre', $form_data["seleccion"]);
            $statement->execute($data);
            $result = $statement->fetch();
            $output["message"] = "Correcto";
            $output["resultado"] = $result;	
        }
        else{
            $output["request"] = $form_data;
        }
        
        return new JsonResponse($output);
    }

}
    