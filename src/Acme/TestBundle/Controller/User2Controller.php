<?php

namespace Acme\TestBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Acme\TestBundle\Entity\User2;
use Acme\TestBundle\Form\User2Type;

/**
 * User2 controller.
 *
 */
class User2Controller extends Controller
{

    /**
     * Lists all User2 entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('AcmeTestBundle:User2')->findAll();

        return $this->render('AcmeTestBundle:User2:index.html.twig', array(
            'entities' => $entities,
        ));
    }


  

    public function facturaAction(Request $request)
    {
        //Query empresa
        $em_e= $this->getDoctrine()->getManager();
        $RAW_QUERY_e = 'SELECT nombreempresa, direccionempresa, duenoempresa,rucempresa FROM empresa;';
        $statement_e = $em_e->getConnection()->prepare($RAW_QUERY_e);
        $statement_e->execute();
        $result_e = $statement_e->fetchAll();

        $em_f = $this->getDoctrine()->getManager();
        $RAW_QUERY_f = 'SELECT idFactura, aut_sri FROM factura;';
        $statement_f = $em_f->getConnection()->prepare($RAW_QUERY_f);
        $statement_f->execute();
        $result_f = $statement_f->fetchAll();


        //$factura_secuencia = '000-00000-00-012';
        $clase = "Creacion";
        return $this->render("AcmeTestBundle:User2:factura.html.twig", array(
            'secuenciaFactura'=>$result_f[0]['idFactura'],
            "clase" => $clase,
            "idFactura" => $result_f[0]["idFactura"],
            "autSri" => $result_f[0]['aut_sri'],
            "nombreEmpresa"=>$result_e[0]["nombreempresa"],
            "direccionEmpresa"=>$result_e[0]["direccionempresa"],
            "duenoEmpresa"=>$result_e[0]["duenoempresa"],
            "rucEmpresa"=>$result_e[0]["rucempresa"],
            
            "result_e"=>$result_e[0],
        ));
    }
    
    public function createAction(Request $request)
    {
        $entity = new User2();
        $form = $this->createCreateForm($entity);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('user2_show', array('id' => $entity->getId())));
        }

        return $this->render('AcmeTestBundle:User2:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Creates a form to create a User2 entity.
     *
     * @param User2 $entity The entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createCreateForm(User2 $entity)
    {
        $form = $this->createForm(new User2Type(), $entity, array(
            'action' => $this->generateUrl('user2_create'),
            'method' => 'POST',
        ));

        $form->add('submit', 'submit', array('label' => 'Create'));

        return $form;
    }

    /**
     * Displays a form to create a new User2 entity.
     *
     */
    public function newAction()
    {
        $entity = new User2();
        $form   = $this->createCreateForm($entity);

        return $this->render('AcmeTestBundle:User2:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Finds and displays a User2 entity.
     *
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('AcmeTestBundle:User2')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find User2 entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return $this->render('AcmeTestBundle:User2:show.html.twig', array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Displays a form to edit an existing User2 entity.
     *
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('AcmeTestBundle:User2')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find User2 entity.');
        }

        $editForm = $this->createEditForm($entity);
        $deleteForm = $this->createDeleteForm($id);

        return $this->render('AcmeTestBundle:User2:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
    * Creates a form to edit a User2 entity.
    *
    * @param User2 $entity The entity
    *
    * @return \Symfony\Component\Form\Form The form
    */
    private function createEditForm(User2 $entity)
    {
        $form = $this->createForm(new User2Type(), $entity, array(
            'action' => $this->generateUrl('user2_update', array('id' => $entity->getId())),
            'method' => 'PUT',
        ));

        $form->add('submit', 'submit', array('label' => 'Update'));

        return $form;
    }
    /**
     * Edits an existing User2 entity.
     *
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('AcmeTestBundle:User2')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find User2 entity.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createEditForm($entity);
        $editForm->handleRequest($request);

        if ($editForm->isValid()) {
            $em->flush();

            return $this->redirect($this->generateUrl('user2_edit', array('id' => $id)));
        }

        return $this->render('AcmeTestBundle:User2:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }
    /**
     * Deletes a User2 entity.
     *
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('AcmeTestBundle:User2')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find User2 entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('user2'));
    }

    /**
     * Creates a form to delete a User2 entity by id.
     *
     * @param mixed $id The entity id
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('user2_delete', array('id' => $id)))
            ->setMethod('DELETE')
            ->add('submit', 'submit', array('label' => 'Delete'))
            ->getForm()
        ;
    }
}
