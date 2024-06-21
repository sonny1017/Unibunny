package dao;

import java.sql.Connection;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;

public class GameLogDAO {

	private static GameLogDAO instance;
	
	public static synchronized GameLogDAO getInstance() {
		if (instance == null) {
			instance = new GameLogDAO();
		}
		return instance;
	}

	private GameLogDAO() {}

	private Connection getConnection() throws Exception {
		Context ctx = new InitialContext();
		DataSource ds = (DataSource) ctx.lookup("java:comp/env/jdbc/oracle");
		return ds.getConnection();
	}
}
